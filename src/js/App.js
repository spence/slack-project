import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { RouteHandler } from 'react-router';

export default class App extends Component {

  render() {
    return (
      <DocumentTitle title='Slack'>
        <RouteHandler {...this.props} />
      </DocumentTitle>
    );
  }

}
