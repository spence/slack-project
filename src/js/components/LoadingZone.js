import React, { Component } from 'react';

export default class LoadingZone extends Component {

  state = { dots: '' }

  componentDidMount () {
    this.timer = setInterval(() => { this.tickdots(this.state.dots); }, 500);
  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  tickdots (dots) {
    this.setState({ dots: '...'.slice(2 - dots.length) });
  }

  render () {
    return (
      <div id="loading-zone">
        <div id="loading_welcome">
          <div style={{marginLeft: '-230px'}}>
            <p id="loading_indicator">Loading {this.state.dots}</p>
            <p id="loading_welcome_msg" style={{opacity: 1}}>There once was an app named Slack.</p>
            <p id="loading_welcome_author" style={{opacity: 1}}>added by Spencer</p>
          </div>
        </div>
      </div>
    );
  }

}
