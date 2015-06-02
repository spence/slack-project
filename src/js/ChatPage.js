import React, { Component } from 'react';
import Channels from './components/Channels';
import Messages from './components/Messages';
import LoadingZone from './components/LoadingZone';

export default class ChatPage extends Component {

  state = { loading: true };

  render() {
    return (
      <div>
        { this.state.loading ? <LoadingZone /> : null }
        <Channels />
        <Messages />
      </div>
    );
  }

}
