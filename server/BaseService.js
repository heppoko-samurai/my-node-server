export default class BaseService {

  constructor(callbacks) {
    this.callbacks = {
      ...callbacks
    };
  }

  on(type, callback) {
    this.callbacks[type] = typeof callback === 'function' ? callback : null;
  }

  off(type) {
    this.callbacks[type] = null;
  }

  fire(type, payload) {
    if (typeof this.callbacks[type] === 'function') {
      return this.callbacks[type](payload);
    }
  }
}
