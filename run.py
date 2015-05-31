#!/usr/bin/env python2.7
"""
gevent socket server that handles both HTTP and WS events until it explodes.

It would make sense to separate these, but since this is fast, we're going to
experiment with it for now.
"""

# Monkey patch python core socket libs
from gevent import monkey
monkey.patch_all()

from app import app
from app.chatserver import SlackChatServer
from geventwebsocket import WebSocketServer, Resource


WebSocketServer(

    ('0.0.0.0', 8000),

    Resource({
        '^/chat': SlackChatServer,
        '^/.*': app
    }),

).serve_forever()
