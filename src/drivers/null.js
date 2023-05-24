import { EventEmitter } from 'events';

export default class NullDriver extends EventEmitter {
  constructor(deviceId, options = {}) {
    super();
    this.universe = Buffer.alloc(513, 0);
    this.interval = 1000 / (options.dmx_speed || 1);
    this.start();
  }

  start() {
    this.timeout = setInterval(() => {
      this.logUniverse();
    }, this.interval);
  }

  stop() {
    clearInterval(this.timeout);
  }

  close(cb) {
    cb(null);
  }

  update(u, extraData) {
    for (const c in u) {
      this.universe[c] = u[c];
    }
    this.logUniverse();

    this.emit('update', u, extraData);
  }

  updateAll(v, _) {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = v;
    }
  }

  get(c) {
    return this.universe[c];
  }

  logUniverse() {
    console.log(this.universe.slice(1));
  }
}
