import Logger from './Console';
import BaseService from './BaseService';

export default class DummyService extends BaseService {

  constructor(options, callbacks) {
    super(callbacks);
    this.count    = 0;
    this.interval = options.interval || 1000 * 60;
    this.sample   = options.sample   || [];
  }

  start() {
    if (!this.sample) throw new Error('Cannot set sample data.');

    const self = this;
    setInterval(() => {
      self.count++;
      const id = self.count % self.sample.length;
      try {
        self.fire('message', require(self.sample[id]));
      } catch (e) {
        Logger.error('Cannot read:' + self.sample[id]);
        Logger.error(e);
      }
    }, this.interval);
  }
}
