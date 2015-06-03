import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/Dispatcher';
import Constants from '../constants/Constants';

export default class BaseStore extends EventEmitter {

  constructor () {
    super();
    this.register = this.register.bind(this);
    Dispatcher.register(this.register);
  }

  register (action) { }

  emitChange () {
    this.emit(Constants.CHANGE_EVENT);
  }

  addChangeListener (callback) {
    this.on(Constants.CHANGE_EVENT, callback);
  }

  removeChangeListener (callback) {
    this.removeListener(Constants.CHANGE_EVENT, callback);
  }

}
