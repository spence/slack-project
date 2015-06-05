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

  state = {
    loading: true,
    connected: false,
    connecting: false,
    authenticationExpired: false,
    channelList: [],
    user: {},
    channel: {}
  }

  static willTransitionTo = (transition, params) => {
    // Check for logged-out users and redirect
    if (!AuthStore.isAuthenticated()) {
      transition.redirect('/login');
    }
    // Init chat socket
    if (AuthStore.isAuthenticated() && !ChatStore.isConnected() && !ChatStore.isConnecting()) {
      Actions.connectChat();
    }
  }

  static willTransitionFrom = (transition, component) => {
    // Clean-up chat
    ChatStore.cleanUpChat();
  }
 
  componentDidMount () {
    ChatStore.addChangeListener(() => { this.onEvent(); });
  }

  componentWillUnmount () {
    ChatStore.removeChangeListener(() => { this.onEvent(); });
  }

  onEvent () {
    this.setState({
      user: ChatStore.getCurrentUser(),
      loading: !ChatStore.isLoaded(),
      channel: ChatStore.getChannel(),
      channelList: ChatStore.getChannelList(),
      connected: ChatStore.isConnected(),
      connecting: ChatStore.isConnecting(),
      authenticationExpired: ChatStore.hasAuthenticationExpired()
    });
    // Check for failure to reconnect due to authentication
    if (!this.state.authenticationExpired) {
      // Clear current token from auth store
      AuthStore.clearAuthentication();
      // redirect to login
      var { router } = this.context;
      router.transitionTo('/login');
    }
  }

  render () {
    var classes = 'container-fluid sidebar_theme_default_theme';
    if (this.state.loading) {
      classes += ' loading'
    }
    return (
      <div id="client-ui" className={classes} style={{height: '100%'}}>
        { this.state.loading ? <LoadingZone /> : null }
        <Header
          loading={this.state.loading}
          connected={this.state.connected}
          user={this.state.user}
          channel={this.state.channel} />
        <Footer
          loading={this.state.loading}
          connected={this.state.connected}
          user={this.state.user}
          channel={this.state.channel} />
        <Body
          loading={this.state.loading}
          connected={this.state.connected}
          user={this.state.user}
          channel={this.state.channel}
          channelList={this.state.channelList} />
      </div>
    );
  }

}
