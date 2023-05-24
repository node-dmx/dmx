import SerialPort from 'serialport';
import { EventEmitter } from 'events';

export default class EnttecOpenUsbDMX extends EventEmitter {
  constructor(deviceId, options = {}) {
    super();
    this.universe = Buffer.alloc(513);
    this.readyToWrite = true;
    this.interval = options.dmx_speed ? (1000 / options.dmx_speed) : 46;

    this.dev = new SerialPort(deviceId, {
      'baudRate': 250000,
      'dataBits': 8,
      'stopBits': 2,
      'parity': 'none',
    }, err => {
      if (!err) {
        this.start();
      } else {
        console.warn(err);
      }
    });
  }

  sendUniverse() {
    const self = this;

    if (!this.dev.writable) {
      return;
    }

    // toggle break
    self.dev.set({brk: true, rts: true}, (err, r) => {
      setTimeout(() => {
        self.dev.set({brk: false, rts: true}, (err, r) => {
          setTimeout(() => {
            if (self.readyToWrite) {
              self.readyToWrite = false;
              self.dev.write(Buffer.concat([Buffer([0]), self.universe.slice(1)]));
              self.dev.drain(() => {
                self.readyToWrite = true;
              });
            }
          }, 1);
        });
      }, 1);
    });
  }

  start() {
    this.intervalhandle = setInterval(this.sendUniverse.bind(this), this.interval);
  }

  stop() {
    clearInterval(this.intervalhandle);
  }

  close(cb) {
    this.stop();
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
