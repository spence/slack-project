import Constants from "../constants/Constants";
import Dispatcher from "../dispatcher/Dispatcher";

export default {

  authenticateUser() {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.AUTH_USER
    });
  },

  connectChat() {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.CONNECT_CHAT
    });
  },

  loadUser(user_key) {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.FETCH_USER,
      user_key: user_key
    });
  },

  enterMessage(message_key, content, channel_key) {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.ENTER_MESSAGE,
      message_key: message_key,
      content: content,
      channel_key: channel_key
    });

  signOut() {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.SIGN_OUT
    });
  },

  leaveChannel(channel_key) {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.LEAVE_CHANNEL
    });
  }

};
