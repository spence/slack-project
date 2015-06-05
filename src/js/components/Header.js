import React, { Component } from 'react';

export default class Header extends Component {

  render () {
    if (this.props.loading) {
      return null;
    }

    return (
      <div id="header" className="feature_flexpane_rework">
          <div id="channel_header">
              <div id="team_menu" className="">
                  <span id="team_name" className="overflow_ellipsis large_right_padding top_margin">Slack-Project</span>
                  <div id="presence_container" className="large_right_padding">
                      <img id="presence" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFb0lEQVR42u2Xe0xTVxzH2ZZlWfxvW2YW98f+2OaiidmmZlaglEefvBRE2RwjguJijKJxDpzipjiGL0Kckc2Z4OJmKW15WoRKsSqi+CA+shUqMnUOfJRy21IotOe7323aIGmujG2JW+Iv+eTe3nPu+X1/v3N+556GPbX/hQF4JnB9jVhNHCF+w5iNEBbiIJFATAm+9285foUoIVx4jDHGELBuIod48W8LAfBs4BpJdAd9/MF1otlagp86srC/TYxv2yLwfXsc9NfW4mzPIXBD9/CIGYjXg+NNKmrevF5vFguE1ee8wSqvbEKxORy7T0tQ0hqF0lYx9rX58d/vPSNGCV2NXfsw6LGzQFbuABAJixBOezLhZfCi446RFZtl+KpFjCJzNHaaJSQiKuAwivA79z/beSoa200iHGjLwN2BzuCc9BDTA+M+J+g82Mh3DryES7eNLN/4LgqaJSQgBjtaJPjmpIQcRWEXQU4DjiUoJmFfU1vhyRhsNUXQbzm73W8Bbz741ABeGsuEYOR9UwDsJXDLZsEXRhHLaxJjy4lYbG2OxjZTNApbyJGZhDxCUdA5tVEfEhCLvCYR9rVmM8ewDbx5vZ60CaP3eDwzALjdoxx+OJ/Hcg3zaKBYEhKLzSdi/INrO3ag514n7JwbtgEHHtj78cvv7TjcvoEyNYd37hecb4zGuob3YLZqAIwSaHa5XFPHshA6788TmwlY+i5jZf0stq5Bgs8bZdjYyEcWh3M3jOAcw3g4wPmdj2cAx68fJsHTsckoRX6TlASEY1NTHOMCWRgdHY0J+gwpOZfr3lRe5ZDXhUPnC/Bp3TwaQIrPjiuQa5iGpusaOJwe2EKd++kfcKLX1oefL+7BGsM0Eq6k96Ox6thcdrq7Cj6MgKzQarW+EBQxLv3cMPcWQAF67KR6AcupC8d6gwor6mZgf2s+bvZ1UdoHeWeCDDiGcOFmC1VCKomIxPoGuT+Q8gvbMewdBFmjw+F4ORj4OAEOj+MdAMw+ZENG1Wzf8tpIrDUkIrMmDLrL5RT9cMCRMP2cC7fv9+BA6xZk176JdYZ4rKgVociUjcERB8jOOp3OV8cJCN6MjAzOBcD63TZ8qJ/ty66Jwqp6FVZSBhquaUIECMH3O9JehvSqMH8Ay2pEKGyepIDFutm+zGoxOVdhee1MGK5OTsCP58uQqgvD6mNJyKyej20nQgQITwEvIEU7x7e0Soyc2iQka8NQcbEczr8gwE5TcIumoPRUAZbop9P8J2Cpfj6+NGbDJSAgZBFyw3asqU9hS3SRyK6JR4puFnafzEd3b+eEi5CjRdhmNWFDQyoyqqOQVaOkbM5HWes2oUUYWobuUSdKTxdgQWU4PtbL8UmVCmm6N1B3pRLOx5Uh56Iy7MXBs3tI9NvIqo6n6OMomyJmtOjhZaFlKLgRXb17CfKK91maNpYGUSJdJ0VOjQxmi5HmWHgj0l46TBHPpCpS+knVRmFZtZQqS2AjEtqKXSMcdrXksYSKCCzWykkAjwyZeinKzhSi666Faj64FdvR0XMOxaYNlKkIEqzARzo5vSeFquID1F9Twye8FQt/jG7ct2CRVsySNbE0mAJpWhmWBCEx6eOhZ2PtfP8kjRgbG7KY3S34MZr4c2y2NjGZeh6SNTKkVCqwsFKOVGJRpYwEjbGIoGd8G/VTIpFE09phfBC8+XwCn+OJDiSUOhLRyNK1KigrpEiqUJAYORYIooBcHUNVlIHuB4IHkskfyXoedrEiUz4U6jio1ArEq+VIeIREQkUspEyVnysF5+4XOJL9s0MppfRXHGzbjdz6FeRQCdlRmg5NIrY05uLoxe/wwNEreCh9osfyJ/fH5Kn91+1P0yiqwz6mfpkAAAAASUVORK5CYII=" className="" title="away" style={{opacity: 0.98}} />
                      <span id="current_user_name" className="overflow_ellipsis">{this.props.user.name}</span>
                  </div>
                  <i className="ts_icon ts_icon_chevron_large_down"></i>
              </div>
              <h2 id="active_channel_name" className="overflow_ellipsis" data-original-title="" title="">
                <span className="name ">
                  <span className="prefix channel"><i className="ts_icon ts_icon_channel"></i></span>
                  {this.props.channel.name}
                </span>
                <i id="channel_actions" className="ts_icon ts_icon_chevron_down ts_icon_inherit"></i>
              </h2>
              <a id="channel_members_toggle" className=""><i className="channel_members_toggle_icon ts_icon ts_icon_user"></i> <span id="channel_members_toggle_count">{this.props.channel.users.length}</span></a>
              <div id="channel_members" className="hidden show_presence popover_menu">
                  <span className="arrow" style={{right: '30px'}}></span><span className="arrow_shadow" style={{right: '30px'}}></span>
                  <div id="monkey_scroll_wrapper_for_members_scroller" className="monkey_scroll_wrapper ">
                      <div className="monkey_scroll_bar ">
                          <div className="monkey_scroll_handle " style={{left: '-3px'}}>
                              <div className="monkey_scroll_handle_inner "></div>
                          </div>
                      </div>
                      <div className="monkey_scroll_hider ">
                          <div id="members_scroller" className="content monkey_scroller"></div>
                      </div>
                  </div>
              </div>
              <div id="team_menu_tip_card_throbber" className="hidden tip_card_throbber"></div>
              <div id="channel_menu_tip_card_throbber" className="hidden tip_card_throbber"></div>
              <div id="search_input_tip_card_throbber" className="hidden tip_card_throbber"></div>
          </div>
          <a id="details_toggle" title="Show Channel Info" className="flexpane_toggle_button"><i className="ts_icon ts_icon_info_circle"></i></a>
          <a id="flex_menu_toggle" title="Open Flexpane Menu" className="flexpane_toggle_button normal"><i className="ts_icon ts_icon_ellipsis"></i><span className="help_icon_icon" id="help_icon_circle_count">0</span></a>
      </div>
    );
  }

}