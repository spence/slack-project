import React, { Component } from 'react';

export default class ChannelInfo extends Component {
  render () {

    // Hide if loading
    if (this.props.channel.direct || this.props.loading) {
      return null;
    }

    return (
      <div id="col_flex" style={{top: '41px', width: '263px', borderLeft: '3px solid #F3F3F3', bottom: '76px'}}>
          <div id="flex_contents" className="tab-content feature_flexpane_rework" style={{opacity: 100}}>
              <div className="tab-pane active" id="details_tab" style={{height: '541px'}}>
                  <div className="heading">
                      <span id="details_tab_header">Members</span>
                      <a id="channel_members_toggle" style={{top: '7px', right: '21px'}}>
                          <i className="channel_members_toggle_icon ts_icon ts_icon_user"></i> <span id="channel_members_toggle_count">{this.props.channel.users.length}</span>
                      </a>
                  </div>
                  <div id="monkey_scroll_wrapper_for_channel_page_scroller" className="monkey_scroll_wrapper ">
                      <div className="monkey_scroll_hider" style={{width: '100%'}}>
                          <div id="channel_page_scroller" className="flex_content_scroller monkey_scroller" style={{height: '100%', width: '255px'}}>
                              <div className="selectable_flex_pane_padder no_top_margin">
                                  <div className="channel_page_members channel_page_section expanded" data-section-name="members">
                                      <div className="channel_page_member_tabs section_header">
                                      </div>
                                      <div className="channel_page_member_lists section_content">
                                          <div id="channel_page_all_members">
                                            {this.props.channel.users.map(function(user) {
                                              var bg = 'url(\'' + user.image_url + '\')';
                                              return (
                                                <div className="channel_page_member_row overflow_ellipsis active" key={user.key}>
                                                    <a className="lazy member_preview_link member_image thumb_20" data-member-id={user.key} data-thumb-size="20"
                                                       style={{backgroundImage: bg, backgroundColor: 'rgb(246, 246, 246)'}} aria-hidden="true"></a>
                                                    <span className="presence active" title="active">
                                                        <i className="ts_icon ts_icon_presence_online presence_icon"></i>
                                                    </span>&nbsp;
                                                    <a data-member-id="U024FSSEZ">{user.name}</a>
                                                </div>
                                              );
                                            })}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}
