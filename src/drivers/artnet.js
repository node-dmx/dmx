import dgram from 'dgram';
import { EventEmitter } from 'events';

export default class ArtnetDriver extends EventEmitter {
  constructor(deviceId = '127.0.0.1', options = {}) {
    super();
    this.readyToWrite = true;
    this.header = Buffer.from([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]);
    this.sequence = Buffer.from([0]);
    this.physical = Buffer.from([0]);
    this.universeId = Buffer.from([0x00, 0x00]);
    this.length = Buffer.from([0x02, 0x00]);

    this.universe = Buffer.alloc(513);
    this.universe.fill(0);

    /**
     * Allow artnet rate to be set and default to 44Hz
     * @type Number
     */
    this.interval = !isNaN(options.dmx_speed) ? 1000 / options.dmx_speed : 24;

    this.universeId.writeInt16LE(options.universe || 0, 0);
    this.host = deviceId;
    this.port = options.port || 6454;
    this.dev = dgram.createSocket('udp4');
    this.dev.bind(() => this.dev.setBroadcast(true));
    this.start();
  }

  sendUniverse(_) {
    const pkg = Buffer.concat([
      this.header,
      this.sequence,
      this.physical,
      this.universeId,
      this.length,
      this.universe.slice(1),
    ]);

    if (this.readyToWrite) {
      this.readyToWrite = false;
      this.dev.send(pkg, 0, pkg.length, this.port, this.host, () => {
        this.readyToWrite = true;
      });
    }
  }

  start() {
    this.timeout = setInterval(this.sendUniverse.bind(this), this.interval);
  }

  stop() {
    clearInterval(this.timeout);
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

  updateAll(v, _) {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = v;
    }
  }

  get(c) {
    return this.universe[c];
  }
}
