
import { EventEmitter } from 'events';

const HEARTBEAT = 'hb';

// Mirror socket.io
const HEARTBEAT_SECS = 15000; // 15 secs
const HEARTBEAT_TIMEOUT_SECS = 20000; // 20 secs
const RECONNECT_SECS = 10000; // 10 secs

const EVENTS = new Set([
  'connect',
  'error',
  'disconnect',
  'reconnect',
  'reconnect_attempt',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed'
]);

let emitter = new EventEmitter();
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
let heartbeatInterval = null;
let lastHeartbeatTime = null;
let heartbeatTimeout = null;
let connectInterval = null;

let sendHeartbeat = () => {
  if (connected) {
    websocket.send(HEARTBEAT);
  }
}

let receiveHeartbeat = () => {
  // Update last heartbeat time
  lastHeartbeatTime = new Date();
  // Restart timeout timer
  clearInterval(heartbeatTimeout);
  clearInterval(connectInterval);
  heartbeatTimeout = setTimeout(() => { connect('reconnect'); }, HEARTBEAT_TIMEOUT_SECS);
};

let connect = (type) => {
  clearInterval(heartbeatTimeout);
  clearInterval(heartbeatInterval);
  clearInterval(connectInterval);
  connecting = true;
  try {
    websocket = new WebSocket(websocketURI);
  } catch (e) {
    connectInterval = setInterval(() => { connect('reconnect') }, RECONNECT_SECS);
    connecting = false;
    return;
  }
  // Bind events
  websocket.onopen = (evt) => {
    connected = true;
    connecting = false;
    // Setup 1s heartbeat timer
    heartbeatInterval = setInterval(() => { sendHeartbeat() }, HEARTBEAT_SECS);
    emitter.emit('connect');
    emitter.emit(type);
  };
  websocket.onmessage = (evt) => {
    // Process but ignore heartbeats
    receiveHeartbeat();
    if (evt.data === HEARTBEAT) {
      return;
    }
    handleMessage.call(this, evt);
  };
  websocket.onerror = (evt) => {
    emitter.emit('error', evt);
  };
  websocket.onclose = (evt) => {
    connect('reconnect');
    emitter.emit('disconnect');
  };
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

  // register a listener for a generic event
  on(eventname, callback) {
    // Allow only buildin events
    if (!EVENTS.has(eventname)) {
      emitter.emit('error', 'No event named \'' + eventname + '\'.');
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
