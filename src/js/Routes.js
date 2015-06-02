import React from 'react';
import { Route, DefaultRoute } from 'react-router';
import App from './App';
import LoginPage from './LoginPage';
import ChatPage from './ChatPage';

export default (
  <Route path="/" handler={App}>
    <DefaultRoute handler={ChatPage} />
    <Route name="login" path="/login" handler={LoginPage} />
  </Route>
);
