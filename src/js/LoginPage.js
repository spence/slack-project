import React, { Component, PropTypes } from 'react';
import AuthStore from './stores/AuthStore';
import Actions from './actions/ActionCreators';

export default class LoginPage extends Component {

  static contextTypes = {
    router: PropTypes.func.isRequired
  }

  state = {
    error: false,
    loading: false,
    authenticated: null
  }

  static willTransitionTo = (transition, params) => {
    // Check for logged-in user and redirect
    if (AuthStore.isAuthenticated()) {
      // Help connect chat since chat page doesn't always receive this event
      Actions.connectChat();
      transition.redirect('/');
    }
  }

  componentDidMount () {
    this.setState(AuthStore.getAuthenticationState());
    AuthStore.addChangeListener(() => { this.onUserChange(); });
  }

  componentWillUnmount () {
    AuthStore.removeChangeListener(() => { this.onUserChange(); });
  }

  onUserChange () {
    this.setState(AuthStore.getAuthenticationState());
    if (AuthStore.isAuthenticated()) {
      var { router } = this.context;
      router.transitionTo('/');
    }
  }

  // Trigger Google Profile login
  handleClick() {
    this.setState({
      error: false,
    });
    Actions.authenticateUser();
  };

  render() {
    return (
      <div className="login">
        <header>
          <a href="https://slack.projects.spencercreasey.com/" id="header_logo"><img src="/static/images/not_slack_logo.png" /></a>
          <div className="header_nav">
            <div className="header_links float_right">
              <a href="http://spencercreasey.com" target="new">Blog</a>
              <a href="http://twitter.com/@spencercreasey" target="new">Twitter</a>
            </div>
          </div>
        </header>
        <div id="page">
          <div id="page_contents">
            {this.state.error ?
              <p className="alert alert_error">
                <i className="ts_icon ts_icon_warning"></i> Failure during authenticating. Please try again.
              </p> : null
            }
            <div className="real_content card align_center span_4_of_6 col float_none margin_auto large_bottom_margin right_padding">
              <h1> Sign in to <span className="break_word">slack-project</span></h1>
              <div className="col span_4_of_6 float_none margin_auto large_bottom_margin">
                <p>
                  <button id="signin_btn" type="submit" onClick={() => { this.handleClick(); }} disabled={this.state.loading ? "disabled" : false}
                          className="btn btn_large full_width ladda-button" data-style="expand-right">
                    <span className="ladda-label">Sign in with Google</span>
                    <span className="ladda-spinner"></span>
                  </button>
                </p>
              </div>
              <p className="subtle_silver small">
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
