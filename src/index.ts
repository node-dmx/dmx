import {EventEmitter} from 'events';
import {UniverseDriver} from './drivers/universe-driver';
import {NullDriver} from './drivers/null';

enum Events {
  update = 'update',
  updateAll = 'updateAll',
}

export interface DmxArgs {
  devices?: any;
}

export class DMX {
  constructor(options: DmxArgs) {
    const devices = options?.devices ?? {};

    this._devices = Object.assign({}, require('./devices'), devices);
    this._animation = require('./anim');

    this.registerDriver('null', NullDriver);
    this.registerDriver('socketio', require('./drivers/socketio'));
    this.registerDriver('dmx4all', require('./drivers/dmx4all'));
    this.registerDriver('enttec-usb-dmx-pro', require('./drivers/enttec-usb-dmx-pro'));
    this.registerDriver('enttec-open-usb-dmx', require('./drivers/enttec-open-usb-dmx'));
    this.registerDriver('dmxking-ultra-dmx-pro', require('./drivers/dmxking-ultra-dmx-pro'));
    this.registerDriver('artnet', require('./drivers/artnet'));
    this.registerDriver('bbdmx', require('./drivers/bbdmx'));
  }

  registerDriver(name: string, module: any): void {
    this._driversByName.set(name, module);
  }

  addUniverse(name: string, driver: string, deviceId, options): UniverseDriver {
    const DriverConstructor = this._driversByName.get(driver);

    const universe = new DriverConstructor(deviceId, options);
    universe.onUpdate((channels, extraData) => {
      this._events.emit(Events.update, name, channels, extraData);
    });

    this._universesByName.set(name, universe);


    return universe;
  }

  onUpdate(cb: (channels, extraData) => void): void {
    this._events.on(Events.update, cb);
  }

  onUpdateAll(cb: (universe, value) => void): void {
    this._events.on(Events.updateAll, cb);
  }

  update(universe: string, channels, extraData): void {
    this._universesByName.get(universe).update(channels, extraData || {});
  }

  updateAll(universe: string, value): void {
    this._universesByName.get(universe).updateAll(value);
    this._events.emit(Events.updateAll, universe, value);
  }

  universeToObject(universeKey: string): void {
    const universe = this._universesByName.get(universeKey);
    const u = {};

    for (let i = 0; i < 512; i++) {
      u[i] = universe.get(i);
    }
    return u;
  }

  private readonly _devices: any;
  private readonly _animation: any;
  private readonly _driversByName: Map<string, new () => UniverseDriver> = new Map();
  private readonly _universesByName: Map<string, UniverseDriver> = new Map();
  private readonly _events = new EventEmitter();
}
