import React from 'react';
import BaseStore from './BaseStore';
import Dispatcher from '../dispatcher/Dispatcher';
import Constants from '../constants/Constants';
import WebSocketRPC from '../utils/WebSocketRPC';

const DEFAULT_CHANNEL = 'general';

let rpc = new WebSocketRPC('wss://slack.projects.spencercreasey.com/chat/');

let _user = {};
let _channel = {messages: []};
let _channelList = [];
let _loaded = false;
let _channelDict = {};
let _userDict = {};

let _userReturned = false;
let _channelReturned = false;
let _channelListReturned = false;
let _messageIDs = {};

let _showCreateChannelModal = false;

/**
 * Fired upon connecting.
 */
rpc.on('connect', () => {
  console.log('connect');
  chatStore.emitChange();

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

  rpc.send('get-channel-list', [], (channelList) => {
    console.log('channel-list', channelList);
    _channelListReturned = true;
    _channelList = channelList;
    // Crappy promise
    if (_userReturned && _channelReturned) {
      _loaded = true;
    }
    _channelList.map(function(channel) {
      _channelDict[channel.name] = channel;
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
      _userDict[user.username] = user;
    })
    chatStore.emitChange();
  });

});

rpc.on('upgrade_auth_token', (authToken) => {
  console.log('new auth token', authToken);
  AuthStore.upgradeAuthToken(authToken);
});

rpc.on('server:broadcast', (data) => {
  console.log('broadcast', data);
  if (data.channel.name == _channel.name) {
    _channel.messages.push(data.message);
  }
  _userDict[data.user.key] = data.user;
  chatStore.emitChange();
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
  console.log('disconnect');
  chatStore.emitChange();
});

/**
 * Fired upon a reconnection.
 * @param {number} reconnect reconnection attempt number.
 */
rpc.on('reconnect', (attempt) => {
  console.log('successful reconnect', attempt);
  chatStore.emitChange();
});

/**
 * Fired upon an attempt to reconnect.
 */
rpc.on('reconnect_attempt', (attempt) => {
  console.log('reconnect_attempt', attempt);
  chatStore.emitChange();
});

/**
 * Fired upon an attempt to reconnect.
 * @param {number} reconnect reconnection attempt number.
 */
rpc.on('reconnecting', () => {
  console.log('reconnecting');
  chatStore.emitChange();
});

/**
 * Fired upon a reconnection attempt error.
 * @param {Object} error error data.
 */
rpc.on('reconnect_error', (error) => {
  console.log('reconnect_error', error);
  chatStore.emitChange();
});

/**
 * Fired when couldn’t reconnect within reconnectionAttempts.
 */
rpc.on('reconnect_failed', (error) => {
  console.log('reconnect_failed', error);
  chatStore.emitChange();
});

rpc.on('reauthenticate', () => {
  console.log('reauthenticate');
  chatStore.emitChange();
});

rpc.on('destroy', () => {
  console.log('destroy');
  chatStore.emitChange();
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

  cleanUpChat() {
    rpc.destroy();
  }

  getMessageId(message_key) {
    return _messageIDs[message_key];
  }

  showCreateChannelModal() {
    return _showCreateChannelModal;
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
          rpc.send('get-user', [action.user_key], (user) => {
            _userDict[user.key] = user;
            chatStore.emitChange();
          });
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
      case Constants.ActionTypes.LEAVE_CHANNEL:
        console.log('TODO: leave channel');
        break;
    }
  }

}

export default chatStore;
