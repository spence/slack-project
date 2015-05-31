

from flask import json
from geventwebsocket import WebSocketApplication

from app import app


class SlackChatServer(WebSocketApplication):
    def on_open(self):
        """
        We're securing our websocket connection via Origin. We're NOT using csrftoken, though we
        could if we were more paranoid. Validating Origin gives us the same benefits without
        needing to mess with matching tokens or wrapping servers, etc.

        We only need to validate during handshake since we're using TSL for our websocket
        connection (wss) and once a connection is made it is considered secure.
        """

        import ipdb; ipdb.set_trace()

        origin = self.ws.origin
        if origin not in app.config['AUTH_ORIGINS']:
            self.on_close('invalid location')
            self.ws.close()

        # log "Some client connected (on {} from {})!".format(origin, client_ip)

    def on_message(self, message):
        if message is None:
            return

        current_client = self.ws.handler.active_client

        try:
            data = json.loads(message)
        except ValueError as exception:
            app.handle_exception(exception)
            current_client.ws.send(json.dumps({
                'error': True,
                'message': 'Unable to parse request',
            }))

        method = data.get('method')
        if method is None:
            current_client.ws.send(json.dumps({
                'error': True,
                'message': 'Missing "method"',
            }))

        # RPC
        if method == 'message':
            self.broadcast(data)
        elif method == 'update_clients':
            self.send_client_list(data)

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
        print "Connection closed! "
