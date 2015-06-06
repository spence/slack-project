import React, { Component, PropTypes } from 'react';
import Actions from '../actions/ActionCreators';
import Constants from '../constants/Constants';
import AuthStore from '../stores/AuthStore';
import ChatStore from '../stores/ChatStore';

export default class Header extends Component {

  static contextTypes = {
    router: PropTypes.func.isRequired
  }

  handleSignOut() {
    // Clear auth and RPC
    Actions.signOut();
    // redirect to login
    var { router } = this.context;
    router.transitionTo('/login');
  }

  handleLeaveChannel() {
    // Show leave only if not in general
    if (this.props.channel.name !== Constants.DEFAULT_CHANNEL) {
      Actions.leaveChannel(this.props.channel.key);
    }
  }

  render () {

    // Hide if loading
    if (this.props.loading) {
      return null;
    }

    // Show leave only if not in general
    var allowSignOut = this.props.channel.name !== Constants.DEFAULT_CHANNEL;

    return (
      <div id="header" className="feature_flexpane_rework">
          <div id="channel_header">
              <div id="team_menu" className="">
                  <span id="team_name" className="overflow_ellipsis large_right_padding top_margin">Slack-Project</span>
                  <div id="presence_container" className="large_right_padding">
                      <img id="presence" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABmFBMVEUAAAD////////////////////////////////////2+/LR5bKw1Hmfy1KUxz2VyD2izVKz1nnS5rP////A3JuOw0qKwkCNxD+QxT6Sxj6Txz6SxUnC3Jv1+fGXx2GDvkCGwECIwUCLwj+PxD6PxT+JwUCFwECZyGD2+vGSxWF9vEGAvkGDv0CMwz+Wx2GPw2F4ukJ7u0J+vUGBvkGHwUB8u0KSxGG31pp0uEN3uUJ5u0KFv0CCv0B6u0K415p5uU1yt0N/vUF1uEN8u0zG3bFttURwtkR5ukLH3rGWxnlqtERutUR2uUOZx3l6uVZos0VvtkRxt0Nzt0N8ulVisUVlskVns0VzuENmskVfsEVps0VztlZer0VhsEVjsUVstER1t1aOwXhcrkZdr0VgsEaQwnm/2a9YrUZbrka/2rDz+PFhr09XrEZksE6pzplUq0ZVrEZarUaqzpl0tWJRq0dWrEZ1tmJztWJOqUdSq0dxtGJMqEdNqUdQqkdytWKmzJhXrFBKqEdZrU+716+GvXhjr1dIp0hkr1dYtVOVAAAAFHRSTlMAV8/v/wCH+x/n////////////9kvBHZAAAAG7SURBVHgBvdOxjtNAEIDhGe/MZO3sxVaiIJkiSNdQUPJOeQlqXoCCIg/EU9BQHRKg5CT7ErzrHTa+aBOqaxC/tdLK+2kbj+H/hoWhlCmQr0HeyYxyM8mvkWHKoAfBS6cBWEeYugAzf4QGp1SV8DvU/ZjBdN7iud6hdnOTdl+TuALyrUPEwfdu3nc1ipr9AwdIFZPysJylRDfa6cZL2rfgMd9QjO8R0Y+/u7sa4LHZz4wN/MXEyw1hbK1VZdV7PZ1OyufzktsxXADCW5EkXq06Paan02Uoo3kHmAEzJ8HBN6v5qlkqaxTmCdAzQK8Noi6rXwCrJyutepUMAARnXS++3cvm2xvftR0PzAyQAXtwdNChifvFHppBdR003IDCIg6JDOse4DX8WIdo1TwfpaUgqWC9c4eqqg5HF20QZdAMmDlasdHWkrKR03J0A4iIXRTrpba29laiY8YMyOyMKYkXroyROZZuwVTyztAFJPmZKBGq+FxFVBr5BHr7ubd3GICfAM+88qDHHYe/BmbbIAaGKU/Fz10emDxyHxBhgJTg+DGP3O3QbltMBkd92F2H9sWxB772wo9z2z8FfwDHWbdKLDfq1AAAAABJRU5ErkJggg==" title="online" style={{opacity: '1'}} />
                      <span id="current_user_name" className="overflow_ellipsis">{this.props.user.name}</span>
                  </div>
              </div>
              <h2 id="active_channel_name" className="overflow_ellipsis" data-original-title="" title="">
                <span className="name ">
                  <span className="prefix channel"><i className="ts_icon ts_icon_channel"></i></span>
                  {this.props.channel.name}
                </span>
                <i id="channel_actions" className="ts_icon ts_icon_chevron_down ts_icon_inherit"></i>
              </h2>
          </div>
          {allowSignOut ?
            <a id="details_toggle" onClick={this.handleLeaveChannel} title="Leave Channel" className="flexpane_toggle_button"><i className="ts_icon ts_icon_times"></i></a>
          : null}
          <a id="flex_menu_toggle" onClick={() => { this.handleSignOut(); }} title="Sign Out" className="flexpane_toggle_button normal"><i className="ts_icon ts_icon ts_icon_sign_out"></i><span className="help_icon_icon" id="help_icon_circle_count">0</span></a>
      </div>
    );
  }

}