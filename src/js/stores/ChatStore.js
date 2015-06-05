import React from 'react';
import BaseStore from './BaseStore';
import Dispatcher from '../dispatcher/Dispatcher';
import Constants from '../constants/Constants';
import WebSocketRPC from '../utils/WebSocketRPC';

let rpc = new WebSocketRPC('wss://slack.projects.spencercreasey.com/chat/');

/**
 * Fired upon connecting.
 */
rpc.on('connect', () => {
  console.log('connect');
  chatStore.emitChange();

  // _fetchUserChannels();
  // _fetchCurrentChannel();

  rpc.send('sum', [1, 2], (sum) => {
    console.log('result of 1 + 1', sum);
  });

  rpc.send('sum', [5, 11], (sum) => {
    console.log('result of 5 + 11', sum);
  });

  rpc.send('sum', [3, 20], (sum) => {
    console.log('result of 3 + 20', sum);
  });

});

rpc.on('upgrade_auth_token', (authToken) => {
  console.log('new auth token', authToken);
  AuthStore.upgradeAuthToken(authToken);
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

let _fetchUserChannels = () => {
  // socket.emit('users:all', this.updateUsers.bind(this));
}

let _fetchCurrentChannel = () => {
  // socket.emit('users:all', this.updateUsers.bind(this));
}

let chatStore = new class ChatStore extends BaseStore {

  isConnected() {
    return rpc.isConnected();
  }

  isConnecting() {
    return rpc.isConnecting();
  }

  getUserChannels() {
    return null;
  }

  getAllChannels() {
    return null;
  }

  getChannel() {
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

  hasAuthenticationExpired() {
    return rpc.hasAuthenticationExpired();
  }

  cleanUpChat() {
    rpc.destroy();
  }

  register (action) {
    switch (action.actionType) {
      case Constants.ActionTypes.CONNECT_CHAT:
        if (!rpc.isConnected() && !rpc.isConnecting()) {
          rpc.connect();
          chatStore.emitChange();
        }
        break;
    }
  }

}

export default chatStore;
