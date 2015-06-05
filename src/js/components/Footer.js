import React, { Component } from 'react';
import ChatStore from '../stores/ChatStore';
import Actions from '../actions/ActionCreators';

export default class Footer extends Component {

  componentDidMount () {
    ChatStore.addChangeListener(() => { this.onChatEvent(); });
  }

  componentWillUnmount () {
    ChatStore.removeChangeListener(() => { this.onChatEvent(); });
  }

  onChatEvent() {
  }

  handleSubmit(e) {
    e.preventDefault();
    var el = $('#message-input');
    // Create unique message key so we can mark our message as sent
    var message_key = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
    Actions.enterMessage(message_key, el.val(), this.props.channel.key);
    // Clear input value
    el.val('');
  }

  render () {

    var textareaclasses = 'with-emoji-menu';
    if (!this.props.connected) {
      textareaclasses += ' offline'
    }

    return (
      <div id="footer" style={{bottom: '0px'}}>
          <div id="footer_overlay" className="onboarding_overlay hidden"></div>
          <div id="footer_msgs">
              <div id="msg_preview" className="hidden lato_regular">
                  <div id="msg_preview_msg" className="message"></div>
              </div>
              <div id="messages-input-container" style={{height: '41px'}}>
                  <form id="message-form" onSubmit={(e) => { this.handleSubmit(e); }} style={{height: '41px'}}>
                      <input id="message-input" className={textareaclasses} disabled={this.props.connected ? null : 'disabled' }
                             aria-label="Message input for Channel #data-activation" autoCorrect="off" autoComplete="off"
                             spellCheck="true" style={{overflowY: 'hidden', height: '38px'}} />
                      <div id="message-input-message" className=""><span></span></div>
                      <div className="hidden tip_card_throbber" id="message_input_tip_card_throbber"></div>
                  </form>
              </div>
          </div>
          <div id="footer_archives" className="hidden">
              <div id="footer_archives_table">
                  <div id="footer_archives_left"><span id="footer_archives_text"></span></div>
                  <div id="footer_archives_right">
                      <a className="btn btn_outline btn_small" id="footer_archives_action_button"></a>
                      <br/><span id="footer_archives_action_tip"></span></div>
              </div>
          </div>
      </div>
    );
  }

}
