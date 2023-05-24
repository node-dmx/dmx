import { EventEmitter } from 'events';
import sacn from 'sacn';

export default class SACNDriver extends EventEmitter {
  constructor(deviceId, options = {}) {
    super();
    this.sACNServer = new sacn.Sender({
      universe: options.universe || 1,
      reuseAddr: true,
    });
    this.universe = {};
  }

  start() {}

  stop() {
    this.sACNServer.close();
  }

  close(cb) {
    this.stop();
    cb(null);
  }

  update(u, extraData) {
    for (const c in u) {
      this.universe[c] = this.dmxToPercent(u[c]);
    }
    this.sendUniverse();
  }

  sendUniverse() {
    this.sACNServer.send({
      payload: this.universe,
    });
  }

  updateAll(v, _) {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = this.dmxToPercent(v);
    }
    this.sendUniverse();
  }

  get(c) {
    return this.percentToDmx(this.universe[c]);
  }

  dmxToPercent(v) {
    return v / 255 * 100;
  }

  percentToDmx(v) {
    return v / 100 * 255;
  }
}
