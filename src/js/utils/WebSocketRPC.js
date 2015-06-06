
import { EventEmitter } from 'events';

const HEARTBEAT = 'HB';
const REAUTHENTICATE = 'AUTH';
const UPGRADE = 'UPGRADE:';

// Mirror socket.io
const HEARTBEAT_SECS = 15000; // 15 secs
const HEARTBEAT_TIMEOUT_SECS = 20000; // 20 secs
const RECONNECT_SECS = 5000; // 5 secs

const EVENTS = new Set([
  'connect',
  'error',
  'disconnect',
  'reconnect',
  'reconnect_attempt',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed',
  'reauthenticate',
  'destroy',
  'upgrade_auth_token',
  'message',
  'server:'
]);

let emitter = new EventEmitter();
emitter.setMaxListeners(200);

let messageCount = 0;
let websocket = null;
let websocketURI = null;

let handleMessage = function(evt) {
  let data = null;
  try {
    data = JSON.parse(evt.data);
  } catch (e) {
    emitter.emit('error', 'Unable to parse message.', e, evt);
  }
  if (data.error !== undefined && data.error !== null) {
    // Handle errors from the server
    emitter.emit('error', data.error, evt);
  } else if (data.server) {
    // Handle server push data
    emitter.emit('server:' + data.server, data);
  } else if (data.id === undefined || data.id === null) {
    // Handle invalid responses from the server
    emitter.emit('error', 'Missing \'id\' from message.', evt);
  } else {
    // Pass along valid response to listener
    emitter.emit('rpc' + data.id, data.value);
  }
}

let connected = false;
let connecting = false;
let authExpired = null;

// Timers
let heartbeatInterval = null;
let heartbeatTimer = null;
let connectTimer = null;

let sendHeartbeat = () => {
  if (connected) {
    websocket.send(HEARTBEAT);
  }
}

let receiveHeartbeat = () => {
  // Restart timeout timer
  clearInterval(heartbeatTimer);
  clearInterval(connectTimer);
  heartbeatTimer = setTimeout(() => { emitter.emit('reconnect_attempt'); connect('reconnect'); }, HEARTBEAT_TIMEOUT_SECS);
};

let connect = (type) => {
  clearInterval(heartbeatTimer);
  clearInterval(heartbeatInterval);
  clearInterval(connectTimer);
  connectTimer = null;
  connecting = true;
  websocket = new WebSocket(websocketURI);
  // Bind events
  websocket.onopen = (evt) => {
    connected = true;
    connecting = false;
    authExpired = false;
    // Setup 1s heartbeat timer
    heartbeatInterval = setInterval(() => { sendHeartbeat(); }, HEARTBEAT_SECS);
    emitter.emit(type);
  };
  websocket.onmessage = (evt) => {
    // Ignore heartbeats
    receiveHeartbeat();
    if (evt.data === HEARTBEAT) {
      return;
    }
    // ignore empty responses
    if (!evt.data) {
      return;
    }
    // The token we have is bad and we need to re-login
    if (evt.data === REAUTHENTICATE) {
      authExpired = true;
      emitter.emit('reauthenticate');
      return;
    }
    // Upgrade token (the one we have is old and will expire soon)
    if (evt.data.substr(0, UPGRADE.length) === UPGRADE) {
      var authToken = evt.data.substr(UPGRADE.length);
      emitter.emit('upgrade_auth_token', authToken);
      return;
    }
    // Handle message
    handleMessage.call(this, evt);
  };
  websocket.onerror = (evt) => {
    emitter.emit('error', evt);
  };
  websocket.onclose = (evt) => {
    connected = false;
    connecting = false;
    // Setup reconnect
    if (!connectTimer) {
      connectTimer = setTimeout(() => { emitter.emit('reconnect_attempt'); connect('reconnect'); }, RECONNECT_SECS);
    }
    emitter.emit('disconnect');
  };
}

let destroy = () => {
  clearInterval(heartbeatTimer);
  clearInterval(heartbeatInterval);
  clearInterval(connectTimer);
  connecting = false;
  connected = false;
  websocket.onclose = function() {};
  websocket.close();
  websocket = null;
  emitter.emit('destroy');
}

export default class WebSocketRPC {

  constructor(uri) {
    websocketURI = uri
  }

  connect() {
    connect('connect');
  }

  isConnected() {
    return connected;
  }

  isConnecting() {
    return connecting;
  }

  hasAuthenticationExpired() {
    return authExpired === false;
  }

  destroy() {
    destroy();
  }

  // register a listener for a generic event
  on(eventname, callback) {
    // Allow only buildin events
    var eventname_trimmed = eventname;
    var colon_index = eventname.indexOf(':');
    if (colon_index != -1) {
      eventname_trimmed = eventname.substr(0, colon_index + 1)
    }
    if (!EVENTS.has(eventname_trimmed)) {
      emitter.emit('error', 'Unknown event name: ' + eventname);
    } else {
      emitter.addListener(eventname, callback);
    }
  }

  // send a message to server, and register a callback for that event
  send(method, args, callback) {
    if (!connected) {
      emitter.emit('error', 'Not connected');
    }
    let id = ++messageCount;
    let message = JSON.stringify({
      id: id,
      method: method,
      args: args
    });
    // Setup 1-time lister
    emitter.once('rpc' + id, callback);
    // Send websocket message
    websocket.send(message);
  }

}
