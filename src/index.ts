import {EventEmitter} from 'events';
import {IUniverseDriver} from './models/IUniverseDriver';
import {Devices, PredefinedDevices} from './devices';
import { Events } from './models/Events';


export interface DmxArgs {
  devices?: any;
}

export class DMX extends EventEmitter {
  private readonly _devices: Devices;
  private readonly _universesByName: Map<string, IUniverseDriver> = new Map();
  constructor(options?: DmxArgs) {
    super();
    const devices = options?.devices ?? {};

    this._devices = Object.assign({}, PredefinedDevices, devices);
  }

  addUniverse(name: string, universe: IUniverseDriver): IUniverseDriver {
    universe.on(Events.update, (channels, extraData) => {
      this.emit(Events.update, name, channels, extraData);
    });

    this._universesByName.set(name, universe);

    return universe;
  }

  update(universe: string, channels: {[key: number]: number}, extraData?: any): void {
    this._universesByName.get(universe)?.update(channels, extraData || {});
  }

  updateAll(universe: string, value: number): void {
    this._universesByName.get(universe)?.updateAll(value);
    this.emit(Events.updateAll, universe, value);
  }

  universeToObject(universeKey: string): {[key: number]: number} {
    const universe = this._universesByName.get(universeKey);
    const u: {[key: number]: number} = {};

    for (let i = 0; i < 512; i++) {
      u[i] = universe?.get(i) || 0;
    }

    return u;
  }

  async close(): Promise<void> {
    for (const uni of this._universesByName.values()) {
      await uni.close();
    }
  }
}
