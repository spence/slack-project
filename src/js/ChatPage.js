import React, { Component, PropTypes } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Body from './components/Body';
import LoadingZone from './components/LoadingZone';
import AuthStore from './stores/AuthStore';
import ChatStore from './stores/ChatStore';
import Actions from './actions/ActionCreators';

export default class ChatPage extends Component {

  static contextTypes = {
    router: PropTypes.func.isRequired
  }

  state = { connected: true }

  componentDidMount () {
    ChatStore.addChangeListener(() => { this.onEvent(); });
  }

  componentWillUnmount () {
    ChatStore.removeChangeListener(() => { this.onEvent(); });
  }

  onEvent () {
    this.setState({
      connected: ChatStore.isConnected(),
      connecting: ChatStore.isConnecting()
    });
  }

  render () {

    // Check for logged-out users and redirect
    if (!AuthStore.isAuthenticated()) {
      var { router } = this.context;
      router.transitionTo('login');
    }

    // Init chat socket
    if (!ChatStore.isConnected() && !ChatStore.isConnecting()) {
      Actions.connectChat();
    }

    return (
      <div id="client-ui" className="container-fluid sidebar_theme_default_theme">
        { this.state.connected ? null: <LoadingZone /> }
        <Header />
        <Footer />
        <Body />
      </div>
    );
  }

}
