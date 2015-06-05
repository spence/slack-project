
import hashlib
import datetime, time
from flask import request, render_template, json, Blueprint, make_response
from oauth2client import client, crypt
from itsdangerous import TimestampSigner

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
        auth_id = request.form['auth_id']
        email = request.form.get('email')
        name = request.form.get('name')
        image_url = request.form.get('image_url')
        idinfo = client.verify_id_token(id_token, app.config['GAUTH_CLIENT_ID'])
        # If multiple clients access the backend server:
        if idinfo['aud'] != app.config['GAUTH_CLIENT_ID']:
            raise crypt.AppIdentityError("Unrecognized client.")
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise crypt.AppIdentityError("Wrong issuer.")
        if request.environ['HTTP_ORIGIN'] != app.config['AUTH_ORIGIN']:
            raise crypt.AppIdentityError("Wrong origin.")
        if auth_id != idinfo['sub']:
            raise crypt.AppIdentityError("User IDs do not match.")
    except crypt.AppIdentityError as exception:
        app.handle_exception(exception)
        return json.jsonify(status='failure')
    except Exception as exception:
        # Catch all
        app.handle_exception(exception)
        return json.jsonify(status='failure')

    # Setup user auth
    user = models.User.query.filter_by(auth_id=auth_id).first()
    if user is None:
        # Add user (strip all special characters for now)
        username = ''.join(c for c in name if c.isalnum())
        if not username or models.User.query.filter_by(username=username).first() is not None:
            # Generate a random one
            username = hashlib.sha1(auth_id).hexdigest()[:15]
        user = models.User(
            auth_id=auth_id,
            username=username,
            name=name,
            email=email,
            image_url=image_url,
        )
        db.session.add(user)
        general_channel = models.Channel.query.filter_by(name=models.GENERAL_CHANNEL).first()
        general_channel.users.append(user)
    else:
        # Update user profile
        user.name = name
        user.email = email
        user.image_url = image_url

    # Create secure self-signed auth token that expires
    # http://pythonhosted.org/itsdangerous/
    signer = TimestampSigner(app.config['SECRET_KEY'])
    auth_token = signer.sign(auth_id)

    # Commit and return
    db.session.commit()

    # Store session cookie so use does not need to refetch this
    expiration_seconds = app.config['AUTH_TOKEN_SECONDS']
    response = make_response(json.jsonify(status='success', auth_id=auth_id, auth_token=auth_token))
    response.set_cookie(key='auth_token', value=auth_token, secure=True, path='/',
                        domain=app.config['AUTH_DOMAIN'], max_age=expiration_seconds)

    return response
