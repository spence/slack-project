import React, { Component, PropTypes } from 'react';
import AuthStore from './stores/AuthStore';
import Actions from './actions/ActionCreators';

export default class LoginPage extends Component {

  static contextTypes = {
    router: PropTypes.func.isRequired
  }

  componentDidMount () {
    AuthStore.addChangeListener(() => { this.onUserChange(); });
  }

  componentWillUnmount () {
    AuthStore.removeChangeListener(() => { this.onUserChange(); });
  }

  onUserChange () {
    var error = false;
    var profile = AuthStore.getUserProfile();
    if (!profile) {
      error = true;
    }
    this.setState({
      authError: error,
      loading: false,
      userProfile: profile
    });
    console.log(profile);
    if (profile) {
      var { router } = this.context;
      router.transitionTo('/');
    }
  }

  state = {
    authError: false,
    loading: false,
    userProfile: null
  }

  render() {

    // Check for logged-in user and redirect
    var profile = AuthStore.getUserProfile();
    if (profile) {
      var { router } = this.context;
      router.transitionTo('/');
    }

    // Trigger Google Profile login
    let handleClick = () => {
      this.state.authError = false;
      this.state.loading = true;
      Actions.authenticateUser();
    };

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
            {this.state.authError ?
              <p className="alert alert_error">
                <i className="ts_icon ts_icon_warning"></i> Failure during authenticating. Please try again
              </p> : null
            }
            <div className="real_content card align_center span_4_of_6 col float_none margin_auto large_bottom_margin right_padding">
              <h1> Sign in to <span className="break_word">slack-project</span></h1>
              <div className="col span_4_of_6 float_none margin_auto large_bottom_margin">
                <p>
                  <button id="signin_btn" type="submit" onClick={handleClick} disabled={this.state.loading}
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
