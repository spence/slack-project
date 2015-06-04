import React, { Component } from 'react';

export default class Header extends Component {

  render () {
    return (
      <div id="header" className="feature_flexpane_rework">
          <div id="channel_header">
              <div id="team_menu" className="">
                  <span id="team_name" className="overflow_ellipsis large_right_padding top_margin">Monetate</span>
                  <div id="presence_container" className="large_right_padding">
                      <img id="presence" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFb0lEQVR42u2Xe0xTVxzH2ZZlWfxvW2YW98f+2OaiidmmZlaglEefvBRE2RwjguJijKJxDpzipjiGL0Kckc2Z4OJmKW15WoRKsSqi+CA+shUqMnUOfJRy21IotOe7323aIGmujG2JW+Iv+eTe3nPu+X1/v3N+556GPbX/hQF4JnB9jVhNHCF+w5iNEBbiIJFATAm+9285foUoIVx4jDHGELBuIod48W8LAfBs4BpJdAd9/MF1otlagp86srC/TYxv2yLwfXsc9NfW4mzPIXBD9/CIGYjXg+NNKmrevF5vFguE1ee8wSqvbEKxORy7T0tQ0hqF0lYx9rX58d/vPSNGCV2NXfsw6LGzQFbuABAJixBOezLhZfCi446RFZtl+KpFjCJzNHaaJSQiKuAwivA79z/beSoa200iHGjLwN2BzuCc9BDTA+M+J+g82Mh3DryES7eNLN/4LgqaJSQgBjtaJPjmpIQcRWEXQU4DjiUoJmFfU1vhyRhsNUXQbzm73W8Bbz741ABeGsuEYOR9UwDsJXDLZsEXRhHLaxJjy4lYbG2OxjZTNApbyJGZhDxCUdA5tVEfEhCLvCYR9rVmM8ewDbx5vZ60CaP3eDwzALjdoxx+OJ/Hcg3zaKBYEhKLzSdi/INrO3ag514n7JwbtgEHHtj78cvv7TjcvoEyNYd37hecb4zGuob3YLZqAIwSaHa5XFPHshA6788TmwlY+i5jZf0stq5Bgs8bZdjYyEcWh3M3jOAcw3g4wPmdj2cAx68fJsHTsckoRX6TlASEY1NTHOMCWRgdHY0J+gwpOZfr3lRe5ZDXhUPnC/Bp3TwaQIrPjiuQa5iGpusaOJwe2EKd++kfcKLX1oefL+7BGsM0Eq6k96Ox6thcdrq7Cj6MgKzQarW+EBQxLv3cMPcWQAF67KR6AcupC8d6gwor6mZgf2s+bvZ1UdoHeWeCDDiGcOFmC1VCKomIxPoGuT+Q8gvbMewdBFmjw+F4ORj4OAEOj+MdAMw+ZENG1Wzf8tpIrDUkIrMmDLrL5RT9cMCRMP2cC7fv9+BA6xZk176JdYZ4rKgVociUjcERB8jOOp3OV8cJCN6MjAzOBcD63TZ8qJ/ty66Jwqp6FVZSBhquaUIECMH3O9JehvSqMH8Ay2pEKGyepIDFutm+zGoxOVdhee1MGK5OTsCP58uQqgvD6mNJyKyej20nQgQITwEvIEU7x7e0Soyc2iQka8NQcbEczr8gwE5TcIumoPRUAZbop9P8J2Cpfj6+NGbDJSAgZBFyw3asqU9hS3SRyK6JR4puFnafzEd3b+eEi5CjRdhmNWFDQyoyqqOQVaOkbM5HWes2oUUYWobuUSdKTxdgQWU4PtbL8UmVCmm6N1B3pRLOx5Uh56Iy7MXBs3tI9NvIqo6n6OMomyJmtOjhZaFlKLgRXb17CfKK91maNpYGUSJdJ0VOjQxmi5HmWHgj0l46TBHPpCpS+knVRmFZtZQqS2AjEtqKXSMcdrXksYSKCCzWykkAjwyZeinKzhSi666Faj64FdvR0XMOxaYNlKkIEqzARzo5vSeFquID1F9Twye8FQt/jG7ct2CRVsySNbE0mAJpWhmWBCEx6eOhZ2PtfP8kjRgbG7KY3S34MZr4c2y2NjGZeh6SNTKkVCqwsFKOVGJRpYwEjbGIoGd8G/VTIpFE09phfBC8+XwCn+OJDiSUOhLRyNK1KigrpEiqUJAYORYIooBcHUNVlIHuB4IHkskfyXoedrEiUz4U6jio1ArEq+VIeIREQkUspEyVnysF5+4XOJL9s0MppfRXHGzbjdz6FeRQCdlRmg5NIrY05uLoxe/wwNEreCh9osfyJ/fH5Kn91+1P0yiqwz6mfpkAAAAASUVORK5CYII=" className="" title="away" style={{opacity: 0.98}} />
                      <span id="current_user_name" className="overflow_ellipsis">Spencer Creasey</span>
                  </div>
                  <i className="ts_icon ts_icon_chevron_large_down"></i>
              </div>
              <h2 id="active_channel_name" className="overflow_ellipsis" data-original-title="" title="">
                <span data-channel-id="C02TH0AV1" className="star ts_icon ts_icon_star ts_icon_inherit starred star_channel"></span>
                <span className="name ">
                  <span className="prefix channel"><i className="ts_icon ts_icon_channel"></i></span>
                  data-activation
                </span>
                <i id="channel_actions" className="ts_icon ts_icon_chevron_down ts_icon_inherit"></i>
              </h2>
              <a id="channel_members_toggle" className=""><i className="channel_members_toggle_icon ts_icon ts_icon_user"></i> <span id="channel_members_toggle_count">13</span></a>
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
          <div id="search_container">
              <form method="get" action="/search" id="header_search_form" className="search_form no_bottom_margin">
                  <div className="highlighter_wrapper">
                      <input type="text" id="search_terms" name="q" className="search_input search_input_highlighted" placeholder="Search" autoComplete="off" value="" maxLength="250" />
                      <div className="highlighter_underlay" style={{outline: 'rgb(85, 84, 89) none 0px', borderWidth: '1px', textIndent: '0px', fontSize: '15px', lineHeight: '24px', fontFamily: 'Emoji Passthrough, Lato, appleLogo, sans-serif', letterSpacing: '0px', wordSpacing: '0px', fontWeight: 400, margin: '2px 30.3999996185303px', width: '130.200000762939px', top: '0px', left: '0px'}}></div>
                  </div>
                  <i className="ts_icon ts_icon_search icon_search"></i> <img className="icon_loading hidden" src="https://slack.global.ssl.fastly.net/272a/img/loading.gif" />
                  <a id="search_clear" className="icon_close client_header_icon"></a>
                  <div className="popover_menu hidden" id="search_autocomplete_popover"><span className="arrow"></span><span className="arrow_shadow"></span>
                      <div id="autocomplete_menu" className="content">
                          <div className="autocomplete_calendar hidden">
                              <div className="pickmeup pmu-view-days" style={{position: 'relative', display: 'inline-block'}}>
                                  <div className="pmu-instance">
                                      <nav>
                                          <div className="pmu-prev pmu-button" style={{visibility: 'visible'}}>◀</div>
                                          <div className="pmu-month pmu-button">June 2015</div>
                                          <div className="pmu-next pmu-button" style={{visibility: 'hidden'}}>▶</div>
                                      </nav>
                                      <nav className="pmu-day-of-week">
                                          <div>Su</div>
                                          <div>Mo</div>
                                          <div>Tu</div>
                                          <div>We</div>
                                          <div>Th</div>
                                          <div>Fr</div>
                                          <div>Sa</div>
                                      </nav>
                                      <div className="pmu-years">
                                          <div className=" pmu-button">2009</div>
                                          <div className=" pmu-button">2010</div>
                                          <div className=" pmu-button">2011</div>
                                          <div className=" pmu-button">2012</div>
                                          <div className=" pmu-button">2013</div>
                                          <div className=" pmu-button">2014</div>
                                          <div className="pmu-selected pmu-button">2015</div>
                                          <div className="pmu-disabled pmu-button">2016</div>
                                          <div className="pmu-disabled pmu-button">2017</div>
                                          <div className="pmu-disabled pmu-button">2018</div>
                                          <div className="pmu-disabled pmu-button">2019</div>
                                          <div className="pmu-disabled pmu-button">2020</div>
                                      </div>
                                      <div className="pmu-months">
                                          <div className=" pmu-button">Jan</div>
                                          <div className=" pmu-button">Feb</div>
                                          <div className=" pmu-button">Mar</div>
                                          <div className=" pmu-button">Apr</div>
                                          <div className=" pmu-button">May</div>
                                          <div className="pmu-selected pmu-button">Jun</div>
                                          <div className="pmu-disabled pmu-button">Jul</div>
                                          <div className="pmu-disabled pmu-button">Aug</div>
                                          <div className="pmu-disabled pmu-button">Sep</div>
                                          <div className="pmu-disabled pmu-button">Oct</div>
                                          <div className="pmu-disabled pmu-button">Nov</div>
                                          <div className="pmu-disabled pmu-button">Dec</div>
                                      </div>
                                      <div className="pmu-days">
                                          <div className="pmu-not-in-month pmu-sunday pmu-button">31</div>
                                          <div className=" pmu-button">1</div>
                                          <div className=" pmu-button">2</div>
                                          <div className="pmu-selected pmu-today pmu-button"><span className="pmu-today-border">3</span></div>
                                          <div className="pmu-disabled pmu-button">4</div>
                                          <div className="pmu-disabled pmu-button">5</div>
                                          <div className="pmu-saturday pmu-disabled pmu-button">6</div>
                                          <div className="pmu-sunday pmu-disabled pmu-button">7</div>
                                          <div className="pmu-disabled pmu-button">8</div>
                                          <div className="pmu-disabled pmu-button">9</div>
                                          <div className="pmu-disabled pmu-button">10</div>
                                          <div className="pmu-disabled pmu-button">11</div>
                                          <div className="pmu-disabled pmu-button">12</div>
                                          <div className="pmu-saturday pmu-disabled pmu-button">13</div>
                                          <div className="pmu-sunday pmu-disabled pmu-button">14</div>
                                          <div className="pmu-disabled pmu-button">15</div>
                                          <div className="pmu-disabled pmu-button">16</div>
                                          <div className="pmu-disabled pmu-button">17</div>
                                          <div className="pmu-disabled pmu-button">18</div>
                                          <div className="pmu-disabled pmu-button">19</div>
                                          <div className="pmu-saturday pmu-disabled pmu-button">20</div>
                                          <div className="pmu-sunday pmu-disabled pmu-button">21</div>
                                          <div className="pmu-disabled pmu-button">22</div>
                                          <div className="pmu-disabled pmu-button">23</div>
                                          <div className="pmu-disabled pmu-button">24</div>
                                          <div className="pmu-disabled pmu-button">25</div>
                                          <div className="pmu-disabled pmu-button">26</div>
                                          <div className="pmu-saturday pmu-disabled pmu-button">27</div>
                                          <div className="pmu-sunday pmu-disabled pmu-button">28</div>
                                          <div className="pmu-disabled pmu-button">29</div>
                                          <div className="pmu-disabled pmu-button">30</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">1</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">2</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">3</div>
                                          <div className="pmu-not-in-month pmu-saturday pmu-disabled pmu-button">4</div>
                                          <div className="pmu-not-in-month pmu-sunday pmu-disabled pmu-button">5</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">6</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">7</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">8</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">9</div>
                                          <div className="pmu-not-in-month pmu-disabled pmu-button">10</div>
                                          <div className="pmu-not-in-month pmu-saturday pmu-disabled pmu-button">11</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div id="" className="monkey_scroll_wrapper ">
                              <div className="monkey_scroll_bar ">
                                  <div className="monkey_scroll_handle " style={{left: '-3px'}}>
                                      <div className="monkey_scroll_handle_inner "></div>
                                  </div>
                              </div>
                              <div className="monkey_scroll_hider ">
                                  <div className="autocomplete_menu_scrollable monkey_scroller">
                                      <div></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </form>
          </div>
          <a id="recent_mentions_toggle" title="Show Recent Mentions" className="flexpane_toggle_button"><i className="ts_icon ts_icon_mentions"></i></a>
          <a id="stars_toggle" title="Show Bookmarks" className="flexpane_toggle_button"><i className="ts_icon ts_icon_star_o"></i></a>
          <a id="flex_menu_toggle" title="Open Flexpane Menu" className="flexpane_toggle_button normal"><i className="ts_icon ts_icon_ellipsis"></i><span className="help_icon_icon" id="help_icon_circle_count">0</span></a>
      </div>
    );
  }

}