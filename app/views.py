
from flask import request, render_template, json, Blueprint
from oauth2client import client, crypt

from app import app, db

import models

mod_root = Blueprint('root', __name__, template_folder='templates')


@mod_root.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@mod_root.route('/', methods=['GET'])
def root():
    return render_template('index.html')


@mod_root.route('/mock', methods=['GET'])
def chat():
    return render_template('chat.html')


@mod_root.route('/googleauth', methods=['POST'])
def gauth_signin():
    """
    Google Authentication
    https://developers.google.com/identity/sign-in/web/backend-auth
    """
    try:
        id_token = request.form['id_token']
        user_id = request.form['user_id']
        email = request.form['email']
        name = request.form['name']
        image_url = request.form['image_url']
        idinfo = client.verify_id_token(id_token, app.config['GAUTH_CLIENT_ID'])
        # If multiple clients access the backend server:
        if idinfo['aud'] != app.config['GAUTH_CLIENT_ID']:
            raise crypt.AppIdentityError("Unrecognized client.")
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise crypt.AppIdentityError("Wrong issuer.")
        if request.environ['HTTP_ORIGIN'] not in app.config['AUTH_ORIGINS']:
            raise crypt.AppIdentityError("Wrong origin.")
        if user_id != idinfo['sub']:
            raise crypt.AppIdentityError("User IDs do not match.")
    except crypt.AppIdentityError as exception:
        app.handle_exception(exception)
        return json.jsonify(status='failure')
    except Exception as exception:
        # Catch all
        app.handle_exception(exception)
        return json.jsonify(status='failure')
    
    # print models.User.query.filter(auth_id=user_id).get()


    # models.User(
    #     auth_id=user_id,
    #     user_at=
    # )

    # app.open_session(request)
    # Get CSRFtoken

    return json.jsonify(user_id=user_id, auth_token='rand', status='success')
