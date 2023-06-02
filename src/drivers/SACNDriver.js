import sacn from 'sacn';
import Driver from 'src/Driver.js';

export default class SACNDriver extends Driver {
  constructor(options = {}) {
    super(options);

    this.SACNServer = new sacn.Sender({
      universe: options.universe || 1,
      reuseAddr: true,
    });

    this.universe = {};
  }

  close() {
    this.SACNServer.close();
  }

  update(values) {
    Driver.prototype.update.call(this, values);

    this.send().then();
  }

  send() {
    return this.SACNServer.send({
      payload: this.universe,
    });
  }

  updateAll(value) {
    Driver.prototype.updateAll.call(this, value);

    this.send().then();
  }
}
