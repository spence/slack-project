#!/bin/bash

# Add secrets to env
source env.sh

gunicorn -k "geventwebsocket.gunicorn.workers.GeventWebSocketWorker" -b 127.0.0.1:8000 --daemon server:resource
