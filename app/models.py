"""
Models for our chat room.
"""

import datetime

from app import db, app

# Identify initial channel by name. Skip thinking about renaming this channel.
GENERAL_CHANNEL = 'general'


def init_db():
    if Channel.query.count() == 0:
        slackbot = User(
            auth_id='',
            title='slackbot',
            username='slackbot',
            bot=True,
            name='Slack Bot',
            email='screasey@gmail.com',
            image_url='https://{}/static/images/slackbot_48.png'.format(app.config['AUTH_DOMAIN'])
        )
        db.session.add(slackbot)
        general_channel = Channel(
            name=GENERAL_CHANNEL,
            owner=slackbot,
            description='',
            private=False,
            direct=False,
        )
        db.session.add(general_channel)
        db.session.commit()


class Base(db.Model):
    """
    Handy base model.
    (copied from https://www.digitalocean.com/community/tutorials/how-to-structure-large-flask-applications)
    """

    __abstract__ = True
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    date_created  = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
                              onupdate=db.func.current_timestamp())


# Subscription table - all the channels that the user is in currently
# Favorite flag would be in this table if we were going to support it
subscription_table = db.Table(
    'channel_subscription', Base.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('channel_id', db.Integer, db.ForeignKey('channel.id'))
)

# Invitation table - all the channels the user has access to
# 1-on-1 chats are lazily created
invitation_table = db.Table(
    'channel_invitation', Base.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('channel_id', db.Integer, db.ForeignKey('channel.id'))
)


class User(Base):
    """
    User table.

    Identified by authentication ID. Profile information is fetched from 3rd parties.
    """
    __tablename__ = 'user'

    # External Unique ID (e.g., Google Profile ID)
    # NB: Would be wise to store auth type as a pair if we support more than 1 type of auth
    auth_id = db.Column(db.String(120), unique=True)

    # User's title
    title = db.Column(db.String(120))

    # User's @name (would be composite with Account if we were supporting that)
    username = db.Column(db.String(120), unique=True)

    # Flag for bots!
    bot = db.Column(db.Boolean, default=False)

    # Online presence
    last_online = db.Column(db.DateTime)

    # Cached profile data taken from their Google Profile. This could be moved into separate table.
    # - read-only (updated on last login)
    # - could be used for offline things like newsletters, change of license
    name = db.Column(db.String(120))  # just truncate the rest
    email = db.Column(db.String(254))  # RFC-5321
    image_url = db.Column(db.String(2083))  # IE max

    created = db.relationship('Channel', backref='owner', order_by='Channel.name')
    channels = db.relationship('Channel', secondary=subscription_table, backref='users')
    invites = db.relationship('Channel', secondary=invitation_table, backref='invited')
    messages = db.relationship('Message', backref='user', order_by='desc(Message.date_created)', lazy='dynamic')

    # Helpful for debugging
    def __repr__(self):
        return '<User %r>' % self.name

    def shallow_json(self):
        return {
            'key': self.id,
            'title': self.title,
            'username': self.username,
            'name': self.name,
            'email': self.email,
            'image_url': self.image_url,
            'online': (datetime.datetime.utcnow() - self.last_online).total_seconds() < 15
        }


class Channel(Base):
    """
    Chat room.

    Can be a public channel, private 1-1 chat, or private group.
    """
    __tablename__ = 'channel'

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # This is unique since we're not doing accounts (it would then be composite)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(256))

    # We're denorming this into two separate values for simplier queries. An argument could
    # be made to create multiple tables but to me, that feels too heavy -- we think about
    # them the same.
    private = db.Column(db.Boolean, default=False)
    direct = db.Column(db.Boolean, default=False)

    messages = db.relationship('Message', backref='channel', order_by='desc(Message.date_created)', lazy='dynamic')

    # Helpful for debugging
    def __repr__(self):
        return '<Channel {}>'.format(self.name)

    def shallow_json(self):
        return {
            'key': self.id,
            'owner_key': self.owner_id,
            'name': self.name,
            'description': self.description,
            'private': self.private,
            'direct': self.direct,
        }


class Message(Base):
    """
    Tracks all the messages within a channel.

    This table will get BIG with more users. May need to store these in a separate DB, though we'll need
    a sorted scan to return latest messages (key-value only DBs are out). Full text searching makes more
    sense in elasticsearch (or solr or cloudsearch or etc). However, those are not fully CP and can lose
    data, so we need a source of truth. So even at scale, Slack likely stores them in a sharded postgres
    or mysql DB (or they're in trouble). Check out Kyles's series on this for some fun reading
    https://aphyr.com/tags/jepsen
    """
    __tablename__ = 'message'

    channel_id = db.Column(db.Integer, db.ForeignKey('channel.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    content = db.Column(db.Text)

    # Helpful for debugging
    def __repr__(self):
        # Allow 30 characters
        content = self.content if len(self.content) <= 30 else '{}...'.format(self.content[:27])
        return '<Message {}>'.format(content)

    def shallow_json(self):
        return {
            'key': self.id,
            'channel_key': self.channel_id,
            'user_key': self.user_id,
            'content': self.content,
            'ts': self.date_created,
        }
