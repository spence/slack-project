import React from 'react';
import BaseStore from './BaseStore';
import Dispatcher from '../dispatcher/Dispatcher';
import Constants from '../constants/Constants';

const AUTH_DOMAINS = {
  'localhost.dev': true,
  'slack.projects.spencercreasey.com': true
}

let _authToken = null;
let _loading = true; // page starts as loading
let _error = false;
let _authenticateUser = (authStore) => {

  _loading = false;
  _error = false;
  authStore.emitChange();

  // Sign the user in, and then retrieve their ID.
  window.auth2.signIn().then(() => {
    var googleUser = window.auth2.currentUser.get();
    var profile = googleUser.getBasicProfile();
    var user = {
      id_token: googleUser.getAuthResponse().id_token,
      auth_id: googleUser.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      image_url: profile.getImageUrl()
    };
    _loading = true;
    _error = false;
    authStore.emitChange();
    $.ajax({
      method: 'POST',
      url: '/googleauth',
      dataType: 'json',
      data: user,
      contentType: 'application/x-www-form-urlencoded',
      headers: {'X-CSRFToken': $('meta[name=csrf-token]').attr('content')},
      success (response) {
        _loading = false;
        // Validate & update state
        if (response.status === 'success' && user.auth_id === response.auth_id) {
          _authToken = response.auth_token;
          _error = false;
        } else {
          _authToken = null;
          _error = true;
        }
        authStore.emitChange();
      },
      error () {
        _authToken = null;
        _loading = false;
        _error = true;
        authStore.emitChange();
      }
    });
  });
};

let authStore = new class AuthStore extends BaseStore {

  register(action) {
    switch (action.actionType) {
      case Constants.ActionTypes.AUTH_USER:
        _authenticateUser(this);
        break;
      case Constants.ActionTypes.SIGN_OUT:
        this.clearAuthentication();
        break;
    }
  }

  getAuthenticationState() {
    return {
      authenticated: !!_authToken,
      error: _error,
      loading: _loading
    };
  }

  getAuthenticationToken() {
    return _authToken;
  }

  isAuthenticated() {
    return _authToken && !_error && !_loading;
  }

  clearAuthentication() {
    _authToken = null;
    _loading = false;
    _error = false;
    var domain = window.location.hostname;
    document.cookie = 'auth_token=0; domain=' + domain + '; path=/; secure; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  upgradeAuthToken(authToken) {
    _authToken = authToken;
    // Set cookie for valid domains (server handles token expiration)
    var domain = window.location.hostname;
    if (AUTH_DOMAINS[domain]) {
      document.cookie = 'auth_token=' + authToken + '; domain=' + domain + '; path=/; secure;';
    }
  }

}

// Enable google button to be clicked
window.registerAuthenticationReady((auth_token) => {
  // We need to allow user to auth via button
  _loading = false;

  // If we have a token, it means the user was already signed in
  if (auth_token) {
    _authToken = auth_token;
  }
  authStore.emitChange();
});

export default authStore;