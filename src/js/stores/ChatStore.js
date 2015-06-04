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
  chatStore.emitChange();
  console.log('disconnect');
});

/**
 * Fired upon a reconnection.
 * @param {number} reconnect reconnection attempt number.
 */
rpc.on('reconnect', (attempt) => {
  chatStore.emitChange();
  console.log('successful reconnect', attempt);
});

/**
 * Fired upon an attempt to reconnect.
 */
rpc.on('reconnect_attempt', (attempt) => {
  chatStore.emitChange();
  console.log('reconnect_attempt', attempt);
});

/**
 * Fired upon an attempt to reconnect.
 * @param {number} reconnect reconnection attempt number.
 */
rpc.on('reconnecting', () => {
  chatStore.emitChange();
  console.log('reconnecting');
});

/**
 * Fired upon a reconnection attempt error.
 * @param {Object} error error data.
 */
rpc.on('reconnect_error', (error) => {
  chatStore.emitChange();
  console.log('reconnect_error', error);
});

/**
 * Fired when couldn’t reconnect within reconnectionAttempts.
 */
rpc.on('reconnect_failed', (error) => {
  chatStore.emitChange();
  console.log('reconnect_failed', error);
});


let _fetchUserChannels = () => {
  // socket.emit('users:all', this.updateUsers.bind(this));
}

let _fetchCurrentChannel = () => {
  // socket.emit('users:all', this.updateUsers.bind(this));
}

let chatStore = new class ChatStore extends BaseStore {

  isConnected () {
    return rpc.isConnected();
  }

  isConnecting () {
    return rpc.isConnecting();
  }

  getUserChannels () {
      return _sftpUsers;
  }

  getAllChannels () {
      return _sftpUsers;
  }

  getChannel () {
      return _sftpUsers;
  }

  createChannel () {
      return _sftpUsers;
  }

  archiveChannel () {
      return _sftpUsers;
  }

  enterChannel () {
      return _sftpUsers;
  }

  leaveChannel () {
      return _sftpUsers;
  }

  register (action) {
    switch (action.actionType) {
      case Constants.ActionTypes.CONNECT_CHAT:
        rpc.connect();
        chatStore.emitChange();
        break;
    }
  }

}

export default chatStore;
