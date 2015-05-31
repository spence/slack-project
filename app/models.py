"""
Models for our chat room.
"""

from app import db

class Base(db.Model):
    """
    Handy base model.
    (copied from https://www.digitalocean.com/community/tutorials/how-to-structure-large-flask-applications)
    """

    __abstract__  = True
    __table_args__ = {'extend_existing': True}

    id            = db.Column(db.Integer, primary_key=True)
    date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
                                           onupdate=db.func.current_timestamp())


class User(Base):
    """
    User table.

    Identified only by authentication ID. Profile information is fetched from 3rd parties.
    """
    __tablename__ = 'user'

    # Auth ID (e.g., Google)
    auth_id = db.Column(db.String(120), unique=True)

    # User's title
    title = db.Column(db.String(120))

    # User's @name (would be composite with Account if we were supporting that)
    user_id = db.Column(db.String(120), unique=True)

    # Denormed profile data taken from their Google Profile. This could be moved into separate table.
    # - read-only (updated on last login)
    # - could be used for offline things like newsletters, change of license
    name = db.Column(db.String(120))  # just truncate the rest
    email = db.Column(db.String(254))  # RFC-5321
    image_url = db.Column(db.String(2083))  # IE max

    # Helpful for debugging
    def __repr__(self):
        return '<User %r>' % self.name


# class UserPreference(Base):

#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
#     user = db.relationship('User', backref=db.backref('preferences', lazy='dynamic'))

#     key = db.Column(db.String(50), primary_key=True)
#     value = db.Column(db.String(150))

#     # Helpful for debugging
#     def __repr__(self):
#         return '<Preference %r>' % self.key


class Channel(Base):
    """
    Chat room.

    Can be a public channel, private 1-1 chat, or private group.
    """
    __tablename__ = 'channel'

    # This is unique since we're not doing accounts (it would then be composite)
    name = db.Column(db.String(80), unique=True)

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship('user', backref=db.backref('created', lazy='dynamic'))

    description = db.Column(db.String(256))

    # We're denorming this into two separate values for simplier queries. An argument could
    # be made to create multiple tables but to me, that feels too heavy -- we think about
    # them the same.
    private = db.Column(db.Boolean, default=False)
    direct = db.Column(db.Boolean, default=False)

    # Helpful for debugging
    def __repr__(self):
        return '<Channel {}>'.format(self.name)


class ChannelMessage(Base):
    """
    Tracks all the messages within a channel.

    This table will get BIG with more users. May need to store these in a separate DB, though we'll need
    a sorted scan to return latest messages (key-value only DBs are out). Full text searching makes more
    sense in elasticsearch (or solr or cloudsearch or etc). However, those are not fully CP and can lose
    data, so we need a source of truth. So even at scale, Slack likely stores them in a sharded postgres
    or mysql DB (or they're in trouble). Check out Kyles's series on this for some fun reading
    https://aphyr.com/tags/jepsen
    """
    __tablename__ = 'channelmessage'

    channel_id = db.Column(db.Integer, db.ForeignKey('channel.id'))
    channel = db.relationship('channel', backref=db.backref('messages', lazy='dynamic'))

    channel_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('user', backref=db.backref('said', lazy='dynamic'))

    timestamp = db.Column(db.DateTime)

    message = db.Column(db.Text)

    # Helpful for debugging
    def __repr__(self):
        # Allow 30 characters
        message = self.message if len(self.message) <= 30 else '{}...'.format(self.message[:27])
        return '<Message {}>'.format(message)


class ChannelSubscription(db.Model):
    """
    Many-to-Many between Users and Channels.

    Exists only when the user is subscribed (will not track history).

    NB: This does not inherit from Base since we don't need additional meta.
    """
    __tablename__ = 'channelsubscription'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    user = db.relationship('user', backref=db.backref('channels', lazy='dynamic'))

    channel_id = db.Column(db.Integer, db.ForeignKey('channel.id'), primary_key=True)
    channel = db.relationship('channel', backref=db.backref('users', lazy='dynamic'))

    # Helpful for debugging
    def __repr__(self):
        return '<Subscription {}:{}>'.format(self.user, self.channel)
