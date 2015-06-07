import React from 'react';
import BaseStore from './BaseStore';
import Dispatcher from '../dispatcher/Dispatcher';
import Constants from '../constants/Constants';
import WebSocketRPC from '../utils/WebSocketRPC';
import Actions from '../actions/ActionCreators';
import RandomKey from '../utils/RandomKey';

const DEFAULT_CHANNEL = 'general';

let domain = window.location.hostname;
let rpc = new WebSocketRPC('wss://' + domain + '/chat/');

let _user = {};
let _channel = {messages: [], users: []};
let _channelList = [];
let _loaded = false;
let _channelDict = {};
let _userDict = {};
let _userRequested = {};

let _userReturned = false;
let _channelReturned = false;
let _channelListReturned = false;
let _messageIDs = {};

let _showCreateChannelModal = false;

let _rebuildChannelTimer = null;

let _createChannelState = {};

let loadChannel = () => {

  rpc.send('get-current-user', [], (user) => {
    console.log('user', user);
    _userReturned = true;
    _user = user;
    // Crappy promise
    if (_channelListReturned && _channelReturned) {
      _loaded = true;
    }
    _userDict[user.key] = user;
    chatStore.emitChange();
  });

  // Since we haven't implemented looking up and joinin a channel by name,
  // we're just fetching all channels that the user has access to.
  rpc.send('get-all-channel-list', [], (channelList) => {
    console.log('channel-list', channelList);
    _channelListReturned = true;
    _channelList = channelList;
    // Crappy promise
    if (_userReturned && _channelReturned) {
      _loaded = true;
    }
    _channelList.map(function(channel) {
      _channelDict[channel.key] = channel;
    })
    chatStore.emitChange();
  });

  var name = _channel.name ? _channel.name : DEFAULT_CHANNEL;
  rpc.send('get-channel', [name], (channel) => {
    console.log('channel', channel);
    _channelReturned = true;
    _channel = channel;
    // Crappy promise
    if (_channelListReturned && _userReturned) {
      _loaded = true;
    }
    channel.users.map(function(user) {
      _userDict[user.key] = user;
    })
    chatStore.emitChange();
  });

}

/**
 * Fired upon connecting.
 */
rpc.on('connect', () => {
  console.log('connect');
  loadChannel();
  chatStore.emitChange();
});

rpc.on('upgrade_auth_token', (authToken) => {
  console.log('new auth token', authToken);
  AuthStore.upgradeAuthToken(authToken);
});

rpc.on('server:message', (data) => {
  console.log('broadcast message', data);
  if (data.channel.name == _channel.name) {
    _channel.messages.push(data.message);
  }
  _userDict[data.user.key] = data.user;
  chatStore.emitChange();
});

rpc.on('server:enter', (data) => {
  console.log('broadcast enter', data);
  if (data.channel.name == _channel.name) {
    _channel.messages.push({
      'key': RandomKey.generate(),
      'channel_key': data.channel.key,
      'user_key': data.user.key,
      'content': 'joined #' + data.channel.name,
      'ephemeral': true,
      'ts': new Date(),
    });
  }
  chatStore.emitChange();
});

rpc.on('server:leave', (data) => {
  console.log('broadcast leave', data);
  if (data.channel.name == _channel.name) {
    _channel.messages.push({
      'key': RandomKey.generate(),
      'channel_key': data.channel.key,
      'user_key': data.user.key,
      'content': 'left #' + data.channel.name,
      'ephemeral': true,
      'ts': new Date(),
    });
  }
  chatStore.emitChange();
});

rpc.on('server:login', (data) => {
  console.log('broadcast login', data);
  _userDict[data.user.key] = data.user;
  _channel.users.map(function(user) {
    if (user.key === data.user.key) {
      user.online = true;
    }
  });
  chatStore.emitChange();
});

rpc.on('server:logout', (data) => {
  console.log('broadcast logout', data);
  // Someone logged out, but since the server cant tell us (bleh), we just
  // requery channel after the 15 sec timeout (16 to be sure).
  if (_rebuildChannelTimer !== null) {
    clearInterval(_rebuildChannelTimer);
  }
  _rebuildChannelTimer = setTimeout(() => {
    _rebuildChannelTimer = null;
    // Really should just have a get-users since this is hacky but works :)
    var name = _channel.name ? _channel.name : DEFAULT_CHANNEL;
    rpc.send('get-channel', [name], (channel) => {
      console.log('channel', channel);
      channel.users.map((user) => {
        _userDict[user.key] = user;
      });
      _channel.users.map((user) => {
        if (user.key in _userDict) {
          user.online = _userDict[user.key].online;
        }
      });
      chatStore.emitChange();
    });
  }, 16000);
});

/**
 * Fired upon a connection error.
 * @param {Object} error error data.
 */
rpc.on('error', (error) => {
  console.log('error', error);
});

/**
 * Fired upon a disconnection.
 */
rpc.on('disconnect', () => {
  console.log('chatstore', 'disconnect');
  // Only fire when we were already loaded
  if (_loaded) {
    _loaded = false;
    chatStore.emitChange();
  }
});

/**
 * Fired upon a reconnection.
 * @param {number} reconnect reconnection attempt number.
 */
rpc.on('reconnect', (attempt) => {
  console.log('successful reconnect', attempt);
  loadChannel();
  chatStore.emitChange();
});

/**
 * Fired upon an attempt to reconnect.
 */
rpc.on('reconnect_attempt', (attempt) => {
  console.log('reconnect_attempt', attempt);
});

/**
 * Fired upon an attempt to reconnect.
 * @param {number} reconnect reconnection attempt number.
 */
rpc.on('reconnecting', () => {
  console.log('reconnecting');
});

/**
 * Fired upon a reconnection attempt error.
 * @param {Object} error error data.
 */
rpc.on('reconnect_error', (error) => {
  console.log('reconnect_error', error);
});

/**
 * Fired when couldn’t reconnect within reconnectionAttempts.
 */
rpc.on('reconnect_failed', (error) => {
  console.log('reconnect_failed', error);
});

rpc.on('reauthenticate', () => {
  console.log('reauthenticate');
  // There will be a change to rpc.hasAuthenticationExpired()
  chatStore.emitChange();
});

rpc.on('destroy', () => {
  console.log('chatstore', 'destroy');
  // Only fire when we were already loaded
  if (_loaded) {
    _loaded = false;
    chatStore.emitChange();
  }
});


let chatStore = new class ChatStore extends BaseStore {

  isConnected() {
    return rpc.isConnected();
  }

  isConnecting() {
    return rpc.isConnecting();
  }

  getCurrentUser() {
    return _user;
  }

  hasAuthenticationExpired() {
    return rpc.hasAuthenticationExpired();
  }

  getChannel() {
    return _channel;
  }

  getChannelList() {
    return _channelList;
  }

  isLoaded() {
    return _loaded;
  }

  getUser(username) {
    return _userDict[username];
  }

  getSearchChannelList() {
    return null;
  }

  createChannel() {
    return null;
  }

  archiveChannel() {
    return null;
  }

  enterChannel() {
    return null;
  }

  leaveChannel() {
    return null;
  }

  getMessageId(message_key) {
    return _messageIDs[message_key];
  }

  showCreateChannelModal() {
    return _showCreateChannelModal;
  }

  getCreateChannelState() {
    return _createChannelState;
  }

  register (action) {
    switch (action.actionType) {
      case Constants.ActionTypes.CONNECT_CHAT:
        if (!rpc.isConnected() && !rpc.isConnecting()) {
          rpc.connect();
          chatStore.emitChange();
        }
        break;
      case Constants.ActionTypes.FETCH_USER:
        // Do we have them already?
        if (action.user_key in _userDict) {
          chatStore.emitChange();
        } else {
          // Fetch them
          if (! action.user_key in _userRequested) {
            _userRequested[action.user_key] = true;
            rpc.send('get-user', [action.user_key], (user) => {
              _userDict[user.key] = user;
              delete _userRequested[user.key];
              chatStore.emitChange();
            });
          }
        }
        break;
      case Constants.ActionTypes.ENTER_MESSAGE:
        rpc.send('send-message', [action.content, action.channel_key], (message_id) => {
          _messageIDs[action.message_key] = message_id;
          chatStore.emitChange();
        });
        break;
      case Constants.ActionTypes.OPEN_CREATE_CHANNEL:
        _showCreateChannelModal = true;
        chatStore.emitChange();
        break;
      case Constants.ActionTypes.CLOSE_CREATE_CHANNEL:
        _showCreateChannelModal = false;
        chatStore.emitChange();
        break;
      case Constants.ActionTypes.SIGN_OUT:
        rpc.destroy();
        _loaded = false;
        break;
      case Constants.ActionTypes.LEAVE_CHANNEL:
        if (action.channel_key in _channelDict) {
          rpc.send('leave-channel', [action.channel_key], (resp) => {
            if (resp.success) {
              _channel = {messages: [], users: []};
              _loaded = false;
              loadChannel();
            }
          });
        }
        break;
      case Constants.ActionTypes.CREATE_CHANNEL:
        rpc.send('create-channel', [action.name, action.description, action.isPrivate], (resp) => {
          _createChannelState = resp;
          if (resp.success) {
            var channel = resp.channel;
            channel.messages = [];
            channel.users = [_user];
            _channelList.push(channel);
            _channelDict[channel.key] = channel;
            _channel = channel;
            Actions.closeCreateChannelModel();
            chatStore.emitChange();
          } else {
            chatStore.emitCreateChannelChange();
          }
        });
        break;
      case Constants.ActionTypes.CHANGE_CHANNEL:
        if (action.channel_key in _channelDict) {
          rpc.send('enter-channel', [action.channel_key], (resp) => {
            if (resp.success) {
              _channel = _channelDict[action.channel_key];
              _channel.messages = _channel.messages || [];
              _channel.users = _channel.users || [];
              _loaded = false;
              loadChannel();
            }
          })
        }
        break;
    }
  }

  emitCreateChannelChange () {
    this.emit(Constants.CREATE_CHANNEL_EVENT);
  }

  addCreateChannelChangeListener (callback) {
    this.on(Constants.CREATE_CHANNEL_EVENT, callback);
  }

  removeCreateChannelChangeListener (callback) {
    this.removeListener(Constants.CREATE_CHANNEL_EVENT, callback);
  }

}

export default chatStore;
