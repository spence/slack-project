"""
App init module
"""

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect

# Define global flask app object
app = Flask(__name__)

# Load values from config.py
app.config.from_object('config')

# Setup CSRF
csrf = CsrfProtect()
csrf.init_app(app)

# Define global DB object
db = SQLAlchemy(app)

# Regster routes
from views import mod_root
app.register_blueprint(mod_root)

# Create the DB models
db.create_all()

# Add default data
from models import init_db
init_db()
