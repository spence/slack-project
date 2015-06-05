"""
Settings file for our app.
"""

# Because we're not in production
DEBUG = True

# Connection string to local MySQL
SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://slackuser:Y4LU3ZxdMD8aL@localhost/slack'
DATABASE_CONNECT_OPTIONS = {'charset': 'utf8mb4', 'use_unicode': 1}

# Google ID Authentication
# (this is a personal token for use only in this project)
GAUTH_CLIENT_ID = '867427487654-4o9ugpqmst50dscliec6d95mokh0k2j1.apps.googleusercontent.com'

# Validate origin for WS and XHR
AUTH_ORIGIN = 'https://slack.projects.spencercreasey.com'

# Setting cookie domain
AUTH_DOMAIN = 'slack.projects.spencercreasey.com'

# Turn on CSRFtoken generation. We don't use forms, but someone would eventually.
# For WS/XHR, we validate using Origin.
CSRF_ENABLED = True
CSRF_SESSION_KEY = "secret"

# Random bits for creating session cookies
SECRET_KEY = "rWpEAVAWVQnY{7=@D72TRwgJJNiK"

# Length of session auth token
AUTH_TOKEN_SECONDS = 60 * 60 * 24 * 7          # 1 week
REISSUE_AUTH_TOKEN_SECONDS = 60 * 60 * 24 * 3  # reissue when less than 3 days
