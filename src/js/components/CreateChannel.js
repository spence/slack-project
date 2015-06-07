import React, { Component } from 'react';
import Actions from '../actions/ActionCreators';
import ChatStore from '../stores/ChatStore';

export default class CreateChannel extends Component {

  constructor() {
    super();
    this.onCreateChannelChange = this.onCreateChannelChange.bind(this);
  }

  state = { submitting: false, validationError: null }

  componentDidMount () {
    ChatStore.addCreateChannelChangeListener(this.onCreateChannelChange);
  }

  componentWillUnmount () {
    ChatStore.removeCreateChannelChangeListener(this.onCreateChannelChange);
  }

  handleFieldsChange() {
    // Clear error on change to fields
    this.setState({
      validationError: null
    });
  }

  onCreateChannelChange() {
    // If we're in here, it's most likely because of a validation error
    var channelState = ChatStore.getCreateChannelState();
    if (!channelState.success) {
      this.setState({
        submitting: false,
        validationError: channelState.validation
      });
    }
  }

  handleCreateChannel(e) {
    e.stopPropagation();
    e.preventDefault();
    var name = $('#channel_create_title').val();
    var description = $('#channel_purpose_input').val();
    var isPrivate = $('#channel_private').is(':checked');

    this.setState({
      submitting: true
    });

    Actions.createChannel(name, description, isPrivate);
  }

  closeModal() {
    Actions.closeCreateChannelModel();
  }

  render () {
    var errorClass = this.state.validationError ? '' : 'hidden';
    return (
      <div id="channel_create_dialog" className="modal hide fade in" aria-hidden="false" style={{display: 'block'}}>
          <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.closeModal}>×</button>
              <h3 className="create_header">Create a channel</h3>
          </div>
          <div className="modal-body" style={{padding: '15px'}}>
              <span id="validation_name_taken" className={'modal_input_note alert name_taken_warning ' + errorClass}>
                  <i className="ts_icon ts_icon_warning"></i>
                  {this.state.validationError}
              </span>
              <p className="top_margin">
                  <label htmlFor="channel_create_title" className="inline_block">Name</label>
                  <input id="channel_create_title" onChange={() => { this.handleFieldsChange(); }} name="title_input" type="text" className="title_input " maxLength="21" />
                  <span className="modal_input_note">
                      Names must be 21 characters or less, lower case and cannot contain spaces or periods.
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
                  <input id="channel_private" defaultChecked={false} type="checkbox" className="small_right_margin" style={{marginLeft: '127px'}} />
                  <label htmlFor="channel_private" className="checkbox no_margin" className="inline_block" style={{marginLeft: '-7px', width: '170px'}}> This is a private group.</label>
              </p>
          </div>
          <div className="modal-footer">
              <a className="btn btn_outline dialog_cancel" onClick={this.closeModal}>Cancel</a>
              <button className="btn dialog_go ladda-button" data-style="expand-right"
                      onClick={(e) => { this.handleCreateChannel(e); }} disabled={this.state.submitting ? "disabled" : false}>
                <span className="ladda-label">Create Channel</span><span className="ladda-spinner"></span>
              </button>
          </div>
      </div>

    );
  }

}
