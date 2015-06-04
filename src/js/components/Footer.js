import React, { Component } from 'react';

export default class Footer extends Component {

  render () {
    return (
      <div id="footer" style={{bottom: '0px'}}>
          <div id="footer_overlay" className="onboarding_overlay hidden"></div>
          <div id="footer_msgs">
              <div id="msg_preview" className="hidden lato_regular">
                  <div id="msg_preview_msg" className="message"></div>
              </div>
              <a onclick="return false;" id="primary_file_button" className="file_upload_btn" aria-label="File menu" style={{height: '41px'}}>
                  <i className="ts_icon ts_icon_arrow_circle_o_up"></i>
              </a>
              <div id="messages-input-container" style={{height: '41px'}}>
                  <form id="message-form" onsubmit="TS.view.submit(); return false;" style={{height: '41px'}}>
                      <a className="emo_menu" aria-label="Emoji menu">
                          <img src="https://slack.global.ssl.fastly.net/272a/img/emoji_menu_button.png" style={{width: '16px', height: '16px'}} />
                      </a>
                      <textarea id="message-input" className="with-emoji-menu" maxLength="" aria-label="Message input for Channel #data-activation" autoCorrect="off" autoComplete="off" spellCheck="true" style={{overflowY: 'hidden', height: '38px'}}></textarea>
                      <div id="message-input-message" className=""><span></span></div>
                      <input type="file" id="file-upload" className="offscreen" multiple="multiple" aria-hidden="true" />
                      <div className="hidden tip_card_throbber" id="message_input_tip_card_throbber"></div>
                  </form>
              </div>
              <div id="notification_bar" className="wide">
                  <div id="notification_text" className="overflow_ellipsis"></div>
                  <div id="typing_text" className="overflow_ellipsis" role="status" aria-live="polite" aria-atomic="true"></div>
                  <div id="special_formatting_text" className="special_formatting_tips" aria-hidden="true"><b>*bold*</b> <i>_italics_</i> <code>`code`</code> <code className="preformatted">```preformatted```</code> <span className="quote">&gt;quote</span></div>
                  <div id="snippet_prompt" className="hidden">
                      <div className="prompt no_wrap" title="" data-original-title="A snippet is a text file that you can create. Instead of sending large messages, consider creating a snippet."><a onclick="TS.client.ui.startSnippetFromChatInput()">Create a Snippet?</a></div>
                      <div className="warning">
                          Text is too long! Create a <a className="snippet_link" onclick="TS.client.ui.startSnippetFromChatInput()" title="" data-original-title="A snippet is a text file that can be much longer than a normal message.">snippet</a> or a <a className="post_link" onclick="TS.client.ui.startPostFromChatInput()" target="_blank" href="/files/create/post" title="" data-original-title="A post is a text file which allows you some more formatting options.">Post</a> instead.
                      </div>
                  </div>
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
