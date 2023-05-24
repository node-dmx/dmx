import dgram from 'dgram';
import { EventEmitter } from 'events';

const UNIVERSE_LEN = 512;

export default class BBDMX extends EventEmitter {
  constructor(deviceId = '127.0.0.1', options = {}) {
    super();

    this.readyToWrite = true;
    this.interval = options.dmx_speed ? (1000 / options.dmx_speed) : 24;
    this.options = options;
    this.universe = Buffer.alloc(UNIVERSE_LEN + 1);
    this.host = deviceId;
    this.port = options.port || 9930;
    this.dev = dgram.createSocket('udp4');
    this.start();
  }

  sendUniverse() {
    if (this.readyToWrite) {
      this.readyToWrite = false;

      let channel;
      let messageBuffer = Buffer.from(UNIVERSE_LEN.toString());

      for (let i = 1; i <= UNIVERSE_LEN; i++) {
        channel = Buffer.from(' ' + this.universe[i]);
        messageBuffer = Buffer.concat([messageBuffer, channel]);
      }

      this.dev.send(messageBuffer, 0, messageBuffer.length, this.port, this.host, () => {
        this.readyToWrite = true;
      });
    }
  }

  start() {
    this.interval = setInterval(this.sendUniverse.bind(this), this.interval);
  }

  stop() {
    clearInterval(this.interval);
  }

  close(cb) {
    this.stop();
    cb(null);
  }

  update(u, extraData) {
    for (const c in u) {
      this.universe[c] = u[c];
    }

    this.emit('update', u, extraData);
  }

  updateAll(v) {
    for (let i = 1; i <= UNIVERSE_LEN; i++) {
      this.universe[i] = v;
    }
  }

  get(c) {
    return this.universe[c];
  }
}
