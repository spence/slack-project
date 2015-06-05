import React, { Component } from 'react';
import ChatStore from '../stores/ChatStore';
import Message from './Message';

export default class Body extends Component {

  componentDidMount () {
    ChatStore.addChangeListener(() => { this.onChatEvent(); });
  }

  componentWillUnmount () {
    ChatStore.removeChangeListener(() => { this.onChatEvent(); });
  }

  onChatEvent() {
    // Scroll to bottom. 
    var el = $('#msgs_scroller_div');
    if (el[0]) {
      el.scrollTop(el[0].scrollHeight);
      // el.animate({ scrollTop: el[0].scrollHeight}, 600);
    }
  }

  render () {
    return (
      <div id="client_body" style={{height: '100%'}}>
          <div id="col_messages" style={{height: '100%'}}>
            {!this.props.loading ? (
              <div className="row-fluid" style={{height: '100%'}}>
                  <div id="col_channels_bg" style={{height: '100%', top: '0px', zIndex: 0}}></div>
                  <div id="col_channels" style={{height: '100%', overflowY: 'scroll'}} className="show_presence channels_list_holder no_just_unreads real_names">
                      <div className="hidden tip_card_throbber" id="channels_tip_card_throbber"></div>
                      <div id="monkey_scroll_wrapper_for_channels_scroller" className="monkey_scroll_wrapper">
                          <div className="monkey_scroll_hider " style={{width: '203px', marginRight: '17px'}}>
                              <div id="channels_scroller" className="monkey_scroller" style={{height: '100%', visibility: 'visible', width: '220px'}}>
                                  <div id="channels" className="section_holder">
                                      <span id="new_channel_btn" className="ts_icon ts_icon_plus_circle channels_list_new_btn" data-toggle="tooltip" title="" data-original-title="Create new channel"></span>
                                      <h2 id="channels_header" className="hoverable">
                                          <span className="channel_list_header_label" data-toggle="tooltip" title="" data-original-title="Browse all channels">Channels</span>
                                      </h2>
                                      <ul id="channel-list">
                                        {this.props.channelList.map(function(channel, i) {
                                          if (channel.private || channel.direct) return null;
                                          return (
                                            <li className="channel" key={channel.key}>
                                                <a className="channel_name" data-channel-id={channel.key}>
                                                    <span className="unread_just hidden">0</span>
                                                    <span className="unread_highlight hidden">0</span>
                                                    <span className="overflow_ellipsis">
                                                        <span className="prefix">#</span> {channel.name}
                                                    </span>
                                                </a>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                      <div className="clear_both"></div>
                                  </div>
                                  <div id="direct_messages" className="section_holder">
                                      <span id="new_dm_btn" className="ts_icon ts_icon_plus_circle channels_list_new_btn" data-toggle="tooltip" title="" data-original-title="Open a Direct Message"></span>
                                      <h2 id="direct_messages_header" className="hoverable" data-toggle="tooltip" title="" data-original-title="Open a Direct Message">Direct Messages</h2>
                                      <ul id="im-list">
                                        {this.props.channelList.map(function(channel, i) {
                                          if (channel.private || !channel.direct) return null;
                                          return (
                                            <li className="member cursor_pointer" key={channel.key}>
                                                <a className="im_name nuc" data-member-id={channel.key}>
                                                    <i className="ts_icon ts_icon_times_circle im_close"></i>
                                                    <span className="unread_highlight hidden">0</span>
                                                    <span className="typing_indicator"></span>
                                                    <span className="overflow_ellipsis">
                                                        <span className="presence" title="away">
                                                          <i className="ts_icon ts_icon_presence_online presence_icon"></i>
                                                        </span> {channel.name}
                                                    </span>
                                                </a>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                      <div className="clear_both"></div>
                                  </div>
                                  <div id="groups" className="section_holder">
                                      <span id="new_pg_btn" className="ts_icon ts_icon_plus_circle channels_list_new_btn" data-toggle="tooltip" title="" data-original-title="Create new group"></span>
                                      <h2 id="groups_header" className="hoverable"><span className="channel_list_header_label" data-toggle="tooltip" title="" data-original-title="Browse your groups">Private Groups</span></h2>
                                      <ul id="group-list">
                                        {this.props.channelList.map(function(channel, i) {
                                          if (!channel.private || channel.direct) return null;
                                          return (
                                            <li className="group cursor_pointer" key={channel.key}>
                                                <a className="group_name" data-group-id={channel.key}>
                                                    <i className="ts_icon ts_icon_times_circle group_close"></i>
                                                    <span className="unread_just hidden">0</span>
                                                    <span className="unread_highlight hidden">0</span>
                                                    <span className="overflow_ellipsis">
                                                      <span className="prefix"></span> {channel.name}
                                                    </span>
                                                </a>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                      <div className="clear_both"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <a id="channel_scroll_up" style={{display: 'none'}} className="" onclick="TS.client.ui.scrollSoTopUnseenChannelIsInView(); return false"><span>more unreads</span> <i className="ts_icon ts_icon_arrow_up small_left_margin"></i></a>
                      <a id="channel_scroll_down" className="hidden" onclick="TS.client.ui.scrollSoBottomUnseenChannelIsInView(); return false"><span>more unreads</span> <i className="ts_icon ts_icon_arrow_down small_left_margin"></i></a>
                  </div>
                  <div id="messages_container" className="has_top_messages_banner" style={{height: '100%'}}>
                      <div id="monkey_scroll_wrapper_for_archive_msgs_scroller_div" className="monkey_scroll_wrapper  hidden">
                          <div className="monkey_scroll_hider ">
                              <div id="archive_msgs_scroller_div" className="hidden monkey_scroller">
                                  <div id="archives_top_div" className="msgs_holder hidden mini italic"></div>
                                  <div id="archives_msgs_div" className="msgs_holder"></div>
                                  <div id="archives_bottom_div" className="msgs_holder hidden mini italic"></div>
                              </div>
                          </div>
                      </div>
                      <div id="monkey_scroll_wrapper_for_msgs_scroller_div" className="monkey_scroll_wrapper" style={{height: '100%'}}>
                          <div className="monkey_scroll_hider " style={{width: '1443px', marginRight: '17px', height: '100%'}}>
                              <div id="msgs_scroller_div" tabIndex="1" className="monkey_scroller" style={{height: '100%', width: '1460px'}}>
                                  <div id="end_div" className="relative mini" style={{height: '324px'}}>
                                      <div id="end_display_div" className="relative">
                                          <div id="end_display_padder" style={{height: '149px'}}></div>
                                          <div id="end_display_meta" className="">
                                              <div id="channel_meta" className="hidden">
                                                  <h1 className="small_bottom_margin channel_meta_name"></h1>
                                                  <p id="channel_meta_random_info" className="hidden">A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you&quote;d prefer to keep out of more focused work-related channels.</p>
                                                  <p id="channel_meta_others_info" className="small_bottom_margin">
                                                      <span className="not_limited_copy">This is the very beginning of the </span> 
                                                      <span className="is_limited_copy hidden">This is the </span>
                                                      <span className="channel_meta_name"></span> channel, which
                                                      <span id="channel_creator_name" className=""></span>
                                                      <span id="channel_create_date"></span>.
                                                      <span id="channel_meta_purpose_container">
                                                      The purpose of this channel is: <span id="channel_meta_purpose" className="italic"></span> (<a className="end_action_purpose">edit</a>).
                                                      </span>
                                                  </p>
                                                  <ul className="end_display_actions">
                                                      <li><a className="end_action_purpose"><i className="ts_icon ts_icon_pencil ts_icon_inherit"></i> Set a purpose</a></li>
                                                      <li><a className="end_action_integration" href="/services/new?channel_id=G056UL149" target="new"><i className="ts_icon ts_icon_plus ts_icon_inherit"></i> Add a service integration</a></li>
                                                      <li><a className="end_action_invite"><i className="ts_icon ts_icon_user ts_icon_inherit"></i> Invite others to this channel</a></li>
                                                  </ul>
                                              </div>
                                              <div id="group_meta" className="">
                                                  <h1 className="small_bottom_margin group_meta_name"><a className="group_link ocean_teal" data-group-id={this.props.channel.key}>{this.props.channel.name}</a></h1>
                                                  <p className="small_bottom_margin">
                                                      <span className="not_limited_copy">This is the very beginning of the </span>
                                                      <span className="is_limited_copy hidden">This is the </span>
                                                      <span className="group_meta_name bold"><a className="group_link ocean_teal" data-group-id={this.props.channel.key}>{this.props.channel.name}</a></span> group.
                                                      <span id="group_meta_purpose_container" className="hidden">
                                                      The purpose of this group is: <span id="group_meta_purpose" className="italic"></span> (<a className="end_action_purpose">edit</a>).
                                                      </span>
                                                      <span id="group_meta_archived_parent" className="hidden">
                                                      It was created from the now archived group <a id="group_meta_archived_parent_link" href="" target="_blank"></a>.
                                                  </span>
                                                      <span className="show_when_ce_enabled hidden">While messages here are generally private to the people within this group, messages sent on or after <span className="js_compliance_export_start"></span> may be accessible to your team owners via <a href="https://slack.zendesk.com/hc/en-us/articles/203950296-FAQs-about-Slack-s-policy-update#complianceexport">Compliance Exports</a>. See <a href="/account/team">Your Team Settings</a> to learn more.</span>
                                                  </p>
                                              </div>
                                              <div id="slackbot_meta" className="hidden">
                                                  <h1>Hi, Slackbot</h1>
                                                  <img src="https://slack.global.ssl.fastly.net/272a/img/slackbot_48.png" alt="Slackbot" className="float_left small_left_margin" style={{marginTop: '0.25rem'}} />
                                                  <p className="icon_offset">This is <span className="not_limited_copy">the very beginning of</span> your message history with Slackbot. Slackbot is pretty dumb, but tries to be helpful.</p>
                                                  <div className="clear_both"></div>
                                                  <i className="ts_icon ts_icon_lightbulb_o callout"></i>
                                                  <p className="icon_offset"><strong>Tip:</strong> Use this message area as your personal scratchpad: anything you type here is private just to you, but shows up in your personal search results. Great for notes, addresses, links or anything you want to keep track of.</p>
                                                  <i className="callout">
                                                  <a href="https://twitter.com/slackhq" target="new"><img src="https://slack.global.ssl.fastly.net/7bf4/img/services/twitter_64.png" className="align_top" /></a>
                                              </i>
                                                  <p className="icon_offset">
                                                      For more tips, along with news and announcements, follow our Twitter account <a href="https://twitter.com/slackhq" target="new" className="bold">@slackhq</a> and check out the <a href="https://twitter.com/search?f=realtime&amp;q=%23changelog%20from%3Aslackhq&amp;src=typd" target="new" className="bold">#changelog</a>.
                                                  </p>
                                              </div>
                                              <div id="im_meta" className="hidden">
                                                  This is Direct Message display
                                              </div>
                                              <div className="is_limited_div is_limited_copy hidden mini">
                                                  <i className="ts_icon ts_icon_comment_o "></i> Your team has more than 10,000 messages in its archive, so although there are older messages than are shown below, you cant see them. <a href="/pricing" target="_blank" className="bold">Find out more about upgrading your team.</a>
                                              </div>
                                          </div>
                                          <div id="end_display_welcome" className="hidden">
                                              <div id="end_display_welcome_general_div" className="hidden">
                                                  <div id="welcome_slide_1" className="hidden welcome_slide">
                                                      <h1 style={{color: '#443642'}} className="align_center no_padding">
                                                      Welcome to<br/>
                                                      <img src="https://slack.global.ssl.fastly.net/66b5/img/landing_slack_hash_wordmark_logo.png" alt="Slack" id="welcome_slide_slack_logo" />
                                                  </h1>
                                                      <p>Slack brings all your team communication into one place, makes it all instantly searchable and available wherever you go.</p>
                                                      <p>Our aim is to make your working life simpler, more pleasant and more productive.</p>
                                                  </div>
                                                  <div id="welcome_slide_2" className="hidden welcome_slide">
                                                      <h1 className="align_center">Synced &amp; Searchable</h1>
                                                      <p>Communication in Slack happens in public channels, direct messages and private groups.</p>
                                                      <p>Everything is indexed, archived and synced across devices so you can always pick up exactly where you left off.</p>
                                                  </div>
                                                  <div id="welcome_slide_3" className="welcome_slide" style={{opacity: 100}}>
                                                      <h1 className="align_center">Youre Ready to Go</h1>
                                                      <p>Install the apps for <a href="/apps" target="new">Mac, iPhone/iPad, Android, and PC</a> for full access to your archives, easy file uploading &amp; messaging and notifications on the go.</p>
                                                      <p id="welcome_slide_app_icons" className="align_center">
                                                          <span className="column apple">
                                                          <a href="https://itunes.apple.com/app/slack-app/id618783545?ls=1&amp;mt=8" target="new">
                                                              <img src="https://slack.global.ssl.fastly.net/0dc1/img/icons/ios-96.png" style={{width: '48px', height: '48px'}} /><br/>
                                                              iOS
                                                          </a>
                                                      </span>
                                                          <span className="column android">
                                                          <a href="https://play.google.com/store/apps/details?id=com.Slack" target="new">
                                                              <img src="https://slack.global.ssl.fastly.net/4d58/img/icons/android-xhdpi.png" style={{width: '48px', height: '48px'}}/><br/>
                                                              Android
                                                          </a>
                                                      </span>
                                                          <span className="column">
                                                              <a href="https://itunes.apple.com/app/slack/id803453959?ls=1&amp;mt=12" target="new">
                                                                  <span className="platform_icon finder_icon" style={{width: '54px', height: '58px'}}></span> Mac
                                                          </a>
                                                          </span>
                                                          <span className="column">                                                   
                                                          <a href="/ssb/download-win" target="new">
                                                              <span className="platform_icon windows_icon" style={{width: '54px', height: '58px'}}></span> Windows
                                                          </a>
                                                          </span>
                                                      </p>
                                                      <p>If you have feedback or need any help, we are standing by: use the <a href="/help" target="new">help</a> and <a href="/help/contact" target="new">feedback page</a> or just send an email to <a href="mailto:feedback@slack.com" target="new">feedback@slack.com</a>.</p>
                                                  </div>
                                                  <div id="welcome_slides_dots" className="hidden">
                                                      <a data-slide="1">•</a>
                                                      <a data-slide="2">•</a>
                                                      <a data-slide="3" className="active">•</a>
                                                  </div>
                                                  <div id="welcome_slides_nav" className="">
                                                      <a className="btn btn_outline welcome_slides_back hidden">Back</a>
                                                      <a className="btn welcome_slides_continue hidden">Continue</a>
                                                      <a className="btn welcome_slides_done hidden">Got it!</a>
                                                  </div>
                                                  <div className="is_limited_div is_limited_copy hidden mini">
                                                      <i className="ts_icon ts_icon_comment_o "></i> Your team has more than 10,000 messages in its archive, so although there are older messages than are shown below, you cant see them.
                                                      <br/><a href="/pricing" target="_blank">Find out more about upgrading your team.</a>
                                                  </div>
                                                  <div id="scroll_to_general_bottom" className="align_center"></div>
                                              </div>
                                          </div>
                                          <div id="end_display_status" className="hidden" aria-live="polite" aria-atomic="true"></div>
                                      </div>
                                  </div>
                                  <div id="msgs_div" className="msgs_holder" style={{paddingBottom: '127px'}}>
                                      <div className="day_divider" id="day_divider_1433443515_000002" data-date="June 4th, 2015" data-ts="1433443515.000002">
                                          <hr role="separator" aria-hidden="true"/><i className="copy_only"><br/>----- </i>
                                          <div className="day_divider_label" aria-label="Today">Today </div><i className="copy_only"> June 4th, 2015 -----</i>
                                      </div>
                                      {this.props.channel.messages.map(function(message, i) {
                                        return (
                                          <Message message={message} key={message.key} />
                                        );
                                      })}
                                  </div>
                                  <div id="msgs_overlay_div" className="hidden" style={{opacity: 0}}></div>
                              </div>
                          </div>
                      </div>
                      <div id="messages_unread_status" className="messages_banner" style={{display: 'none'}} onclick="TS.client.ui.scrollMsgsSoFirstUnreadMsgIsInView(); return false">
                          <span className="actual new_msgs_jump_link">Jump</span>
                          <span id="new_msg_info" className="overflow_ellipsis">&nbsp;</span>
                          <a className="clear_unread_messages" onclick="TS.client.ui.forceMarkAllRead(TS.model.marked_reasons.clicked); return false;" data-toggle="tooltip" title="" data-original-title="Mark messages as read (Use ESC to clear this)">
                              Mark as read <i className="ts_icon ts_icon_times_small float_right"></i>
                          </a>
                      </div>
                      <div id="file_progress" className="messages_banner hidden">
                          <div id="progress_bar"></div>
                          <div id="progress_text"></div>
                      </div>
                      <div id="connection_div" style={{display: this.props.connected ? 'none' : 'block'}} className="messages_banner" role="status" aria-live="assertive" aria-atomic="true">reconnecting...</div>
                      <div id="archives_return" className="messages_banner messages_banner_bottom hidden" style={{top: '414px'}}>
                          <span id="archives_info" className="overflow_ellipsis">Viewing archives from <span id="archives_return_date" className=""></span></span>
                          <a className="cancel_archives hidden">Jump to recent messages <i className="ts_icon ts_icon_arrow_down float_right"></i></a>
                      </div>
                  </div>
              </div>
            ) : null} 
          </div>
      </div>
    );
  }

}
