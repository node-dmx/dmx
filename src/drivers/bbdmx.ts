import { EventEmitter } from 'events';
import { IUniverseDriver, UniverseData } from '../models/IUniverseDriver';

const dgram = require('dgram');

const UNIVERSE_LEN = 512;

export interface BBDMXArgs {
  dmxSpeed?: number,
  port?: number,
}

export class BBDMXDriver extends EventEmitter implements IUniverseDriver {
  readyToWrite: boolean;
  interval: number;
  timeout?: any;
  options: {};
  universe: Buffer;
  host: string;
  port: any;
  dev: any;
  constructor(deviceId = '127.0.0.1', options: BBDMXArgs = {}) {
    super();
    this.readyToWrite = true;
    this.interval = options.dmxSpeed ? (1000 / options.dmxSpeed) : 24;
    this.options = options;
    this.universe = Buffer.alloc(UNIVERSE_LEN + 1);
    this.host = deviceId;
    this.port = options.port || 9930;
    this.dev = dgram.createSocket('udp4');
    this.start();
  }

  sendUniverse(): void {
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

  start(): void {
    this.timeout = setInterval(this.sendUniverse.bind(this), this.interval);
  }

  stop(): void {
    if (this.timeout) clearInterval(this.timeout);
  }

  close(): void {
    this.stop();
  }

  update(u: UniverseData, extraData?: any): void {
    for (const c in u) {
      this.universe[c] = u[c];
    }

    this.emit('update', u, extraData);
  }

  updateAll(v: number): void {
    for (let i = 1; i <= UNIVERSE_LEN; i++) {
      this.universe[i] = v;
    }
  }

  get(c: number): number {
    return this.universe[c];
  }
}
