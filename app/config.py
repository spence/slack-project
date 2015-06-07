"""
Settings file for our app.
"""
import os

DEBUG = False

# Connection string to local MySQL
SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://{}:{}@localhost/slack'.format(
    os.environ['MYSQL_USER'], os.environ['MYSQL_PASS'])
DATABASE_CONNECT_OPTIONS = {'charset': 'utf8mb4', 'use_unicode': 1}

# Google ID Authentication
# (this is a personal token for use only in this project)
GAUTH_CLIENT_ID = os.environ['GAUTH_CLIENT_ID']

# Validate origin for WS and XHR
AUTH_ORIGIN = 'https://slack.projects.spencercreasey.com'

# Setting cookie domain
AUTH_DOMAIN = 'slack.projects.spencercreasey.com'

# Turn on CSRFtoken generation. We don't use forms, but someone would eventually.
# For WS/XHR, we validate using Origin.
CSRF_ENABLED = True
CSRF_SESSION_KEY = "secret"

# Random bits for creating session cookies
SECRET_KEY = os.environ['GAUTH_CLIENT_ID']

# Length of session auth token
AUTH_TOKEN_SECONDS = 60 * 60 * 24 * 7          # 1 week
REISSUE_AUTH_TOKEN_SECONDS = 60 * 60 * 24 * 3  # reissue when less than 3 days
