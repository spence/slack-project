import React, { Component } from 'react';
import ChatStore from '../stores/ChatStore';
import Actions from '../actions/ActionCreators';

export default class Header extends Component {

  state = { user: {} }

  componentDidMount () {
    ChatStore.addChangeListener(() => { this.onChatEvent(); });
    Actions.loadUser(this.props.message.user_key);
  }

  componentWillUnmount () {
    ChatStore.removeChangeListener(() => { this.onChatEvent(); });
  }

  onChatEvent() {
    var user = ChatStore.getUser(this.props.message.user_key);
    if (user) {
      this.setState({
        user: user
      });
    }
  }

  render () {
    var bg = 'url(\'' + (this.state.user.image_url || 'about:blank') + '\')';
    // add "joined" to class for events
    return (
      <div className="message show_user avatar first divider">
          <a className="member_preview_link member_image thumb_36" data-member-id={this.props.message.user_key} data-thumb-size="36" style={{backgroundImage: bg}} aria-hidden="true"></a>
          <i className="copy_only"><br/></i>
          <a className="message_sender member" data-member-id={this.props.message.user_key}> {this.state.user.name}</a><i className="copy_only"></i>
          <i className="copy_only">[</i><a className="timestamp">{this.props.message.ts}</a><i className="copy_only">]</i>
          <span className="message_content">{this.props.message.content}</span>
      </div>
    );
  }

}