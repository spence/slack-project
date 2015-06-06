import React, { Component } from 'react';
import Actions from '../actions/ActionCreators';
// import ChatStore from '../stores/ChatStore';

export default class CreateChannel extends Component {

  state = { private: false }

  // componentDidMount () {
  //   ChatStore.addChangeListener(() => { this.onChatEvent(); });
  // }

  // componentWillUnmount () {
  //   ChatStore.removeChangeListener(() => { this.onChatEvent(); });
  // }

  // onChatEvent() {
  //   // Scroll to bottom. 
  //   var el = $('#msgs_scroller_div');
  //   if (el[0]) {
  //     el.scrollTop(el[0].scrollHeight);
  //   }
  // }

  handlePrivateChange() {
    this.setState({
      private: !this.state.private
    });
  }

  closeModal() {
    Actions.closeCreateChannelModel();
  }

  render () {
    return (
      <div id="channel_create_dialog" className="modal hide fade in" aria-hidden="false" style={{display: 'block'}}>
          <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.closeModal}>×</button>
              <h3 className="create_header">Create a channel</h3>
          </div>
          <div className="modal-body" style={{padding: '15px'}}>
              <p className="top_margin">
                  <label htmlFor="channel_create_title" className="inline_block">Name</label>
                  <input id="channel_create_title" name="title_input" type="text" className="title_input " value="" maxLength="21" />
                  <span className="modal_input_note">
                      Names must be 21 characters or less, lower case and cannot contain spaces or periods.
                  </span>
                  <span className="modal_input_note alert hidden name_taken_warning">
                      <i className="ts_icon ts_icon_warning"></i>
                      That name has been taken. Try something different.
                  </span>
                  <span className="modal_input_note alert hidden invalid_chars_warning">
                      <i className="ts_icon ts_icon_warning"></i>
                      You entered some disallowed characters in the name, which we&quot;ve fixed. Make sure it looks good to you, and try again!
                  </span>
                  <span className="modal_input_note alert hidden single_punctuation_warning">
                      <i className="ts_icon ts_icon_warning"></i>
                      Sorry! Names cannot be a single hyphen or underscore.
                  </span>
              </p>
              <p>
                  <label htmlFor="channel_purpose_input" className="inline_block">
                      Purpose
                      <br/>
                      <span className="normal">(optional)</span>
                  </label>
                  <textarea id="channel_purpose_input" name="channel_purpose_input" type="text" style={{height: '4.5rem'}} maxLength="250"></textarea>
                  <span className="modal_input_note">Give your channel a purpose that describes what it will be used for.</span>
              </p>
              <p>
                  <input id="channel_private" defaultChecked={this.state.private} onChange={this.handlePrivateChange} type="checkbox" className="small_right_margin" style={{marginLeft: '127px'}} />
                  <label htmlFor="channel_private" className="checkbox no_margin" className="inline_block" style={{marginLeft: '-7px', width: '170px'}}> This is a private group.</label>
              </p>
          </div>
          <div className="modal-footer">
              <a className="btn btn_outline dialog_cancel" onClick={this.closeModal}>Cancel</a>
              <button className="btn dialog_go ladda-button" data-style="expand-right"><span className="ladda-label">Create Channel</span><span className="ladda-spinner"></span></button>
          </div>
      </div>

    );
  }

}
