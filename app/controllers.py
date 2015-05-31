
from flask import request, render_template, json, Blueprint
from oauth2client import client, crypt

from app import app

import models

mod_root = Blueprint('root', __name__)


@mod_root.route('/', methods=['GET'])
def root():
    return render_template('chat.html')


@mod_root.route('/googleauth', methods=['POST'])
def gauth_signin():
    """
    Google Authentication
    https://developers.google.com/identity/sign-in/web/backend-auth
    """
    try:
        id_token = request.form['idtoken']
        idinfo = client.verify_id_token(id_token, app.config['GAUTH_CLIENT_ID'])
        # If multiple clients access the backend server:
        if idinfo['aud'] != app.config['GAUTH_CLIENT_ID']:
            raise crypt.AppIdentityError("Unrecognized client.")
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise crypt.AppIdentityError("Wrong issuer.")
        # if idinfo['hd'] not in app.config['AUTH_DOMAIN_NAMES']:
        #     raise crypt.AppIdentityError("Wrong hosted domain.")
        print idinfo['hd'] if 'hd' in idinfo else 'None!?'
    except crypt.AppIdentityError as exception:
        app.handle_exception(exception)
        return json.jsonify(status='failure')
    user_id = idinfo['sub']

    # app.open_session(request)
    # Get CSRFtoken

    return json.jsonify(user=user_id, status='success')
