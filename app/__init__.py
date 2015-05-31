"""
App init module
"""

import os
import newrelic.agent
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

# Base app dir
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# NewRelic for debugging
newrelic.agent.initialize(os.path.join(BASE_DIR, '..', 'newrelic.ini'), 'Slack')

# Define global flask app object
app = Flask(__name__)

# Load values from config.py
app.config.from_object('config')

# Define global DB object
db = SQLAlchemy(app)

# Regster routes
from controllers import mod_root
app.register_blueprint(mod_root)

# Create the DB models
db.create_all()
