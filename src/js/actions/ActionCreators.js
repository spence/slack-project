import Constants from "../constants/Constants";
import Dispatcher from "../dispatcher/Dispatcher";

export default {

  authenticateUser () {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.AUTH_USER
    });
  },

  connectChat () {
    Dispatcher.dispatch({
      actionType: Constants.ActionTypes.CONNECT_CHAT
    });
  }

};
