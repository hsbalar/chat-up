import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class Store extends EventEmitter {
  constructor() {
    super();
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(listener) {
    return this.on(CHANGE_EVENT, listener);
  }

  removeChangeListener(listener) {
    return this.removeListener(CHANGE_EVENT, listener);
  }
}

export default Store;
