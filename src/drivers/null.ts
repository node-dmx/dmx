import {EventEmitter} from 'events';
import {IUniverseDriver} from '../models/IUniverseDriver';

export interface NullDriverArgs {
  dmx_speed?: number;
}

export class NullDriver extends EventEmitter implements IUniverseDriver {
  constructor(options: NullDriverArgs = {}) {
    super();

    this._universe = Buffer.alloc(513, 0);
    this._interval = 1000 / (options?.dmx_speed ?? 1);
    this.start();
  }

  start(): void {
    this._timeout = setInterval(() => {
      this.logUniverse();
    }, this._interval);
  }

  stop(): void {
    clearInterval(this._timeout);
  }

  close(): void {}

  update(u: {[key: number]: number}, extraData: any): void {
    for (const c in u) {
      this._universe[c] = u[c];
    }
    this.logUniverse();

    this.emit('update', u, extraData);
  }

  updateAll(v: number): void {
    for (let i = 1; i <= 512; i++) {
      this._universe[i] = v;
    }
  }

  get(c: number): number {
    return this._universe[c];
  }

  logUniverse(): void {
    console.log(this._universe.slice(1));
  }

  private readonly _universe: Buffer;
  private readonly _interval: number;
  private _timeout: any;
}
