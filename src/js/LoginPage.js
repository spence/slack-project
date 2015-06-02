import React, { Component } from 'react';

export default class LoginApp extends Component {

  handleClick(event) {
    gapi.auth.signIn();
    // {
    //   'callback': (authResult) => {
    //     console.log(authResult)
    //     // if (authResult['status']['signed_in']) {
    //     //   console.log('ok!');
    //     // }
    //   }
    // });

    // auth2.signIn({'redirect_uri': 'postmessage'}).then((authResult) => {
    //   if (authResult['code']) {
    //     $.ajax({
    //       method: 'POST',
    //       url: '/googleauth',
    //       contentType: 'application/octet-stream; charset=utf-8',
    //       data: { idtoken: googleUser.getAuthResponse().id_token },
    //       processData: false,
    //       done: function(resp) {
    //           console.log('Signed in as: ', resp);
    //       },
    //       fail: function() {
    //           console.log('Failed');
    //       }
    //     });
    //   }
    // });
  }

  render() {
    return (
      <div className="login">
        <header>
          <a href="https://slack.projects.spencercreasey.com/" id="header_logo"><img src="/static/images/not_slack_logo.png" /></a>
          <div className="header_nav">
            <div className="header_links float_right">
              <a href="/is">Tour</a>
              <a href="http://slackhq.com" target="new">Blog</a>
              <a href="http://twitter.com/@slackhq" target="new">Twitter</a>
            </div>
          </div>
        </header>
        <div id="page">
          <div id="page_contents">
            <div className="real_content card align_center span_4_of_6 col float_none margin_auto large_bottom_margin right_padding">
              <h1> Sign in to <span className="break_word">slack.projects.spencercreasey.com</span></h1>
              <div className="col span_4_of_6 float_none margin_auto large_bottom_margin">
                <p>
                  <button id="signin_btn" type="submit" onClick={this.handleClick}
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
