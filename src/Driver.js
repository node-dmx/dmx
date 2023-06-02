import { EventEmitter } from 'events';

export const DMX_MAX_CHANNEL = 512;
export const INTERVAL = 50;
export const EVENT_START = 'start';
export const EVENT_STOP = 'stop';
export const EVENT_READY = 'ready';

export default class Driver extends EventEmitter {
  constructor(options) {
    super();

    this.universe = Buffer.alloc(DMX_MAX_CHANNEL + 1, 0);
    this.interval = 1000 / (options.interval || INTERVAL);
    this.timeout = null;
  }

  init(error) {
    if (error) {
      console.error(error);
    } else {
      this.emit(EVENT_READY);
      this.start();
    }
  }

  start() {
    this.timeout = setInterval(this.send.bind(this), this.interval);

    this.emit(EVENT_START);
  }

  stop() {
    clearInterval(this.timeout);

    this.emit(EVENT_STOP);
  }

  get(address) {
    return this.universe[address];
  }

  set(address, value) {
    this.universe[address] = value;
  }

  getPercent(address) {
    return (this.get(address) / DMX_MAX_CHANNEL) * 100;
  }

  update(values) {
    for (const address in values) {
      this.universe[address] = values[address];
    }
  }

  updateAll(value) {
    this.universe.fill(value, 0, DMX_MAX_CHANNEL);
  }

  send() {
  }
}
