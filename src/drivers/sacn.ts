import { EventEmitter } from 'events';
import { IUniverseDriver, UniverseData } from '../models/IUniverseDriver';
import * as sacn from 'sacn';

export class SACNDriver extends EventEmitter implements IUniverseDriver {
  sACNServer: any;
  universe: any = {};
  constructor(universe = 1) {
    super();
    this.sACNServer = new sacn.Sender({
      universe: universe || 1,
      reuseAddr: true,
    });
  }

  start(): void {}

  stop(): void {
    this.sACNServer.close();
  }

  close(): void {
    this.stop();
  }

  update(u: UniverseData, extraData: any): void {
    for (const c in u) {
      this.universe[c] = this.dmxToPercent(u[c]);
    }
    this.sendUniverse();
  }

  sendUniverse(): void {
    this.sACNServer.send({
      payload: this.universe,
    });
  }

  updateAll(v: number): void {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = this.dmxToPercent(v);
    }
    this.sendUniverse();
  }

  get(c: number): number {
    return this.percentToDmx(this.universe[c]);
  }

  dmxToPercent(v: number): number {
    return v / 255 * 100;
  }

  percentToDmx(v: number): number {
    return v / 100 * 255;
  }
}
