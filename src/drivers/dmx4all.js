import SerialPort from 'serialport';
import { EventEmitter } from 'events';

const UNIVERSE_LEN = 512;

export default class DMX4ALL extends EventEmitter {
  constructor(deviceId, options = {}) {
    super();

    this.universe = Buffer.alloc(UNIVERSE_LEN + 1);
    this.readyToWrite = true;
    this.interval = 1000 / (options.dmx_speed || 33);

    this.dev = new SerialPort(deviceId, {
      'baudRate': 38400,
      'dataBits': 8,
      'stopBits': 1,
      'parity': 'none',
    }, err => {
      if (!err) {
        this.start();
      } else {
        console.warn(err);
      }
    });
    // this.dev.on('data', data => {
    //   process.stdout.write(data.toString('ascii'))
    // });
  }

  sendUniverse() {
    if (!this.dev.writable) {
      return;
    }

    if (this.readyToWrite) {
      this.readyToWrite = false;

      const msg = Buffer.alloc(UNIVERSE_LEN * 3);

      for (let i = 0; i < UNIVERSE_LEN; i++) {
        msg[i * 3] = (i < 256) ? 0xE2 : 0xE3;
        msg[i * 3 + 1] = i;
        msg[i * 3 + 2] = this.universe[i + 1];
      }

      this.dev.write(msg);
      this.dev.drain(() => {
        this.readyToWrite = true;
      });
    }
  }

  start() {
    this.intervalhandle = setInterval(this.sendUniverse.bind(this), this.interval);
  }

  stop() {
    clearInterval(this.intervalhandle);
  }

  close(cb) {
    this.dev.close(cb);
  }

  update(u, extraData) {
    for (const c in u) {
      this.universe[c] = u[c];
    }

    this.emit('update', u, extraData);
  }

  updateAll(v) {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = v;
    }
  }

  get(c) {
    return this.universe[c];
  }
}
