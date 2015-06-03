import React from 'react';
import BaseStore from './BaseStore';
import Dispatcher from '../dispatcher/Dispatcher';
import Constants from '../constants/Constants';

let _authUser = null;
let _authenticateUser = (emitter) => {

  // Sign the user in, and then retrieve their ID.
  auth2.signIn().then(() => {
    var googleUser = auth2.currentUser.get();
    var profile = googleUser.getBasicProfile();
    var user = {
      id_token: googleUser.getAuthResponse().id_token,
      user_id: auth2.currentUser.get().getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      image_url: profile.getImageUrl()
    };
    $.ajax({
      method: 'POST',
      url: '/googleauth',
      dataType: 'json',
      data: user,
      contentType: 'application/x-www-form-urlencoded',
      success (response) {
        // Validate & update state
        if (response.status === 'success' && user.user_id === response.user_id) {
          _authUser = {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            image_url: user.image_url,
            auth_token: response.auth_token
          }
        } else {
          _authUser = null;
        }
        emitter.emitChange();
      },
      error () {
        _authUser = null;
        emitter.emitChange();
      }
    });
  });
};

export default new class AuthStore extends BaseStore {

  register (action) {
    switch (action.actionType) {
      case Constants.ActionTypes.AUTH_USER:
        _authenticateUser(this);
        break;
    }
  }

  getUserProfile () {
    return _authUser;
  }

}
