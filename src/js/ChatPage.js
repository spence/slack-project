import React, { Component, PropTypes } from 'react';
import Channels from './components/Channels';
import Messages from './components/Messages';
import LoadingZone from './components/LoadingZone';
import AuthStore from './stores/AuthStore';

export default class ChatPage extends Component {

  static contextTypes = {
    router: PropTypes.func.isRequired
  }

  state = { loading: true }

  render () {

    // Check for logged-out users and redirect
    var profile = AuthStore.getUserProfile();
    if (!profile) {
      var { router } = this.context;
      router.transitionTo('login');
    }

    return (
      <div>
        { this.state.loading ? <LoadingZone /> : null }
        <Channels />
        <Messages />
      </div>
    );
  }

}
