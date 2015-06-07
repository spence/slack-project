
import datetime

from flask import json
from geventwebsocket import WebSocketApplication
from werkzeug.http import parse_cookie
from itsdangerous import TimestampSigner, SignatureExpired, BadSignature

from app import app, models, db


class SlackChatServer(WebSocketApplication):

    def get_auth_user(self):
        """
        Use self-signed TimestampSigner to retrieve auth_id
        """
        auth_token = parse_cookie(self.ws.environ['HTTP_COOKIE']).get('auth_token')
        if auth_token is None:
            self.on_close('invalid authentication')
            self.ws.send('AUTH')  # tell client to reauth
            self.ws.close()
        else:
            expiration_seconds = app.config['AUTH_TOKEN_SECONDS']
            signer = TimestampSigner(app.config['SECRET_KEY'])
            try:
                auth_id = signer.unsign(auth_token, max_age=expiration_seconds)

                # Validate user is in db
                user = models.User.query.filter_by(auth_id=auth_id).first()
                if user is None:
                    self.ws.send('AUTH')
                    self.ws.close()
                    return

                # Upgrade token if token is about to expire
                try:
                    reissue_seconds = app.config['REISSUE_AUTH_TOKEN_SECONDS']
                    auth_id = signer.unsign(auth_token, max_age=reissue_seconds)
                except SignatureExpired:
                    signer = TimestampSigner(app.config['SECRET_KEY'])
                    auth_token = signer.sign(auth_id)
                    self.ws.send('UPGRADE:{}'.format(auth_token))

                return user

            except SignatureExpired:
                self.on_close('auth token expired')
                self.ws.send('AUTH')  # tell client to reauth
                self.ws.close()
            except BadSignature:
                self.on_close('invalid authentication')
                self.ws.send('AUTH')  # tell client to reauth
                self.ws.close()

    def on_open(self):
        """
        We're securing our websocket connection via Origin. We're NOT using csrftoken, though we
        could if we were more paranoid. Validating Origin gives us the same benefits without
        needing to mess with matching tokens or wrapping servers, etc.

        We only need to validate during handshake since we're using TSL for our websocket
        connection (wss) and once a connection is made it is considered secure.
        """

        # Validate origin
        origin = self.ws.origin
        if origin not in app.config['AUTH_ORIGIN']:
            self.on_close('invalid origin: {}'.format(origin))
            self.ws.close()
            return

        # Validate user auth token
        user = self.get_auth_user()
        if user is None:
            return

        # Mark as online
        user.last_online = datetime.datetime.utcnow()
        db.session.commit()

        # Let everyone else know this user is online
        self.broadcast(json.dumps({
            'server': 'login',
            'user': user.shallow_json()
        }))

        db.session.close()

    def on_message(self, message):
        if message is None:
            return

        user = self.get_auth_user()
        if user is None:
            return

        # Mark as online
        user.last_online = datetime.datetime.utcnow()
        db.session.commit()

        # Handle heartbeat
        if message == 'HB':
            self.ws.send('HB')
            return

        # Decode data and process rpc
        try:
            data = json.loads(message)
        except ValueError as exception:
            app.handle_exception(exception)
            self.ws.send(json.dumps({
                'error': True,
                'message': 'Unable to parse request',
            }))

        method = data.get('method')
        if method is None:
            self.ws.send(json.dumps({
                'error': True,
                'message': 'Missing rpc method',
            }))
        message_id = data.get('id')
        if message_id is None:
            self.ws.send(json.dumps({
                'error': True,
                'message': 'Missing rpc ID',
            }))

        # RPC
        args = data.get('args')

        # Switch methods
        if method == 'get-current-user':
            self.get_current_user(user, message_id, *args)
        elif method == 'get-channel':
            self.get_channel(user, message_id, *args)
        elif method == 'get-channel-list':
            self.get_channel_list(user, message_id, *args)
        elif method == 'get-user':
            self.get_user(user, message_id, *args)
        elif method == 'send-message':
            self.send_message(user, message_id, *args)
        elif method == 'create-channel':
            self.create_channel(user, message_id, *args)
        elif method == 'get-all-channel-list':
            self.get_all_channel_list(user, message_id, *args)
        elif method == 'enter-channel':
            self.enter_channel(user, message_id, *args)
        elif method == 'leave-channel':
            self.leave_channel(user, message_id, *args)
        else:
            self.ws.send(json.dumps({
                'id': message_id,
                'error': 'Unknown rpc method: {}'.format(method)
            }))

        db.session.close()

    def get_current_user(self, user, message_id):
        self.ws.send(json.dumps({
            'id': message_id,
            'value': user.shallow_json(),
        }))

    def get_channel(self, user, message_id, channel_name):
        """
        Channel that is either public or the user has been invited.
        """
        channel = models.Channel.query \
            .outerjoin(models.Channel.invited) \
            .filter(db.or_(models.User.id == user.id, models.Channel.private == False)) \
            .filter(models.Channel.name == channel_name) \
            .first()

        if channel is not None:
            # Load last 30 messages
            messages = list(channel.messages.limit(30))

            channel_json = channel.shallow_json()
            channel_json['messages'] = [m.shallow_json() for m in reversed(messages)]
            channel_json['users'] = [u.shallow_json() for u in channel.users]

            self.ws.send(json.dumps({
                'id': message_id,
                'value': channel_json,
            }))

    def get_channel_list(self, user, message_id):
        self.ws.send(json.dumps({
            'id': message_id,
            'value': [c.shallow_json() for c in user.channels],
        }))

    def get_all_channel_list(self, user, message_id):
        channels = models.Channel.query \
            .outerjoin(models.Channel.invited) \
            .filter(db.or_(models.User.id == user.id, models.Channel.private == False)) \
            .all()
        self.ws.send(json.dumps({
            'id': message_id,
            'value': [c.shallow_json() for c in channels],
        }))

    def get_user(self, _, message_id, user_key):
        request_user = models.User.query.get(user_key)
        self.ws.send(json.dumps({
            'id': message_id,
            'value': request_user.shallow_json() if request_user else None
        }))

    def send_message(self, user, message_id, content, channel_id):
        # Fetch channel in question
        # Validates if user has permission to submit message to channel
        channel = models.Channel.query \
            .outerjoin(models.Channel.invited) \
            .filter(db.or_(models.User.id == user.id, models.Channel.private == False)) \
            .filter(models.Channel.id == channel_id) \
            .first()

        if channel is None:
            self.ws.send(json.dumps({
                'id': message_id,
                'value': {
                    'denied': True,
                }
            }))
        else:
            message = models.Message(channel_id=channel.id, user_id=user.id, content=content)
            db.session.add(message)
            db.session.commit()

            # Confirm message for specific user (releases their input field)
            self.ws.send(json.dumps({
                'id': message_id,
                'value': message.id,
            }))

            # Broadcast message to everyone
            # This is a dumb idea. All users in all channels (even private) get their
            # messages send to everyone, publicly. I would probably re-init the ws
            # using a query param or path, specifying my channel (e.g., client.ws.path).
            self.broadcast(json.dumps({
                'server': 'message',
                'channel': channel.shallow_json(),
                'message': message.shallow_json(),
                'user': user.shallow_json()
            }))

    def enter_channel(self, user, message_id, channel_id):
        channel = models.Channel.query \
            .outerjoin(models.Channel.invited) \
            .filter(db.or_(models.User.id == user.id, models.Channel.private == False)) \
            .filter(models.Channel.id == channel_id) \
            .first()
        if channel is None:
            self.ws.send(json.dumps({
                'id': message_id,
                'value': {
                    'success': False,
                }
            }))

        channel.users.append(user)
        db.session.commit()

        self.ws.send(json.dumps({
            'id': message_id,
            'value': {
                'success': True,
            }
        }))

        self.broadcast(json.dumps({
            'server': 'enter',
            'channel': channel.shallow_json(),
            'user': user.shallow_json(),
        }))

    def leave_channel(self, user, message_id, channel_id):
        channel = models.Channel.query \
            .outerjoin(models.Channel.invited) \
            .filter(db.or_(models.User.id == user.id, models.Channel.private == False)) \
            .filter(models.Channel.id == channel_id) \
            .first()
        if channel is None:
            self.ws.send(json.dumps({
                'id': message_id,
                'value': {
                    'success': False,
                }
            }))

        channel.users.remove(user)
        db.session.commit()

        self.ws.send(json.dumps({
            'id': message_id,
            'value': {
                'success': True,
            }
        }))

        self.broadcast(json.dumps({
            'server': 'leave',
            'channel': channel.shallow_json(),
            'user': user.shallow_json(),
        }))

    def create_channel(self, user, message_id, name, description, private):
        # Check if name is free
        if models.Channel.query.filter_by(name=name).first() is not None:
            self.ws.send(json.dumps({
                'id': message_id,
                'value': {
                    'success': False,
                    'validation': 'Name is already taken.',
                }
            }))
        elif name == '' or name is None or len(name) > 21:
            self.ws.send(json.dumps({
                'id': message_id,
                'value': {
                    'success': False,
                    'validation': 'Invalid name.',
                }
            }))
        else:
            # Create new channel and relationships
            channel = models.Channel(
                name=name,
                description=description,
                private=private,
                direct=False,
                owner=user,
                users=[user],  # subscribe user to channel
            )
            db.session.add(channel)
            if private:
                user.invites.append(channel)
            db.session.commit()

            self.ws.send(json.dumps({
                'id': message_id,
                'value': {
                    'success': True,
                    'channel': channel.shallow_json(),
                }
            }))

    def broadcast(self, obj):
        for client in self.ws.handler.server.clients.values():
            if not client.ws.closed:
                client.ws.send(obj)

    def on_close(self, reason):

        # Since we cant access the user object from here and let other clients
        # know who logged out, we just send a logout message so each client can
        # request user online status
        self.broadcast(json.dumps({
            'server': 'logout'
        }))

        db.session.close()
