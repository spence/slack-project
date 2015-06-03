#!/usr/bin/env python2.7
"""
gevent socket server that handles both HTTP and WS events until it explodes!

It would make sense to separate these, but since this is fast and this isn't a
complicated app, I'm leaving them.
"""

from app import app
from app.chatserver import SlackChatServer
from geventwebsocket import WebSocketServer, Resource

WebSocketServer(

    ('0.0.0.0', 8000),

    Resource({
        '^/chat/': SlackChatServer,
        '^/.*': app
    }),

).serve_forever()
