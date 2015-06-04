
from flask import json
from geventwebsocket import WebSocketApplication
from werkzeug.http import parse_cookie
from itsdangerous import TimestampSigner, SignatureExpired, BadSignature

from app import app


class SlackChatServer(WebSocketApplication):

    def get_user_id(self):
        """
        Use self-signed TimestampSigner to retrieve user_id
        """
        auth_token = parse_cookie(self.ws.environ['HTTP_COOKIE']).get('auth_token')
        if auth_token is None:
            self.on_close('invalid authentication')
            self.ws.close()
        else:
            expiration_seconds = app.config['AUTH_TOKEN_SECONDS']
            signer = TimestampSigner(app.config['SECRET_KEY'])
            try:
                return signer.unsign(auth_token, max_age=expiration_seconds)
            except SignatureExpired:
                self.on_close('auth token expired')
                self.ws.close()
            except BadSignature:
                self.on_close('invalid authentication')
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
        if origin != app.config['AUTH_ORIGIN']:
            self.on_close('invalid origin: {}'.format(origin))
            self.ws.close()
            return

        # Validate user auth token
        self.get_user_id()

    def on_message(self, message):
        if message is None:
            return

        print "user: {}".format(self.get_user_id())
        print repr(message)

        # Handle heartbeat
        if message == 'hb':
            self.ws.send('hb')
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

        print repr(data)

        method = data.get('method')
        if method is None:
            self.ws.send(json.dumps({
                'error': True,
                'message': 'Missing "method"',
            }))
        message_id = data.get('id')
        if message_id is None:
            self.ws.send(json.dumps({
                'error': True,
                'message': 'Missing "id"',
            }))

        # RPC
        args = data.get('args')
        if method == 'message':
            self.broadcast(message_id, *args)
        elif method == 'update_clients':
            self.send_client_list(message_id, *args)
        elif method == 'add':
            self.add(message_id, *args)
        else:
            self.ws.send(json.dumps({
                'id': message_id,
                'error': 'Unknown "method"'
            }))

    def add(self, message_id, one, two):
        self.ws.send(json.dumps({
            'id': message_id,
            'value': one + two
        }))

    def send_client_list(self, message):
        current_client = self.ws.handler.active_client
        current_client.nickname = message['nickname']

        self.ws.send(json.dumps({
            'msg_type': 'update_clients',
            'clients': [
                getattr(c, 'nickname', 'anonymous')
                for c in self.ws.handler.server.clients.values()
            ]
        }))

    def broadcast(self, message):
        for c in self.ws.handler.server.clients.values():
            c.ws.send(json.dumps({
                'msg_type': 'message',
                'nickname': message['nickname'],
                'message': message['message']
            }))

    def on_close(self, reason):
        # print "Connection closed! "
        pass

