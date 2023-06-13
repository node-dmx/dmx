import { EventEmitter } from 'events';
import ArtNetDriver from './drivers/ArtNetDriver.js';
import BBDMXDriver from './drivers/BBDMXDriver.js';
import NullDriver from './drivers/NullDriver.js';
import DMX4AllDriver from './drivers/DMX4AllDriver.js';
import DMXKingUltraDmxProDriver from './drivers/DMXKingUltraDMXProDriver.js';
import EntTecOpenUsbDMXDriver from './drivers/EntTecOpenUsbDMXDriver.js';
import EntTecUSBDMXProDriver from './drivers/EntTecUsbDMXProDriver.js';
import SACNDriver from './drivers/SACNDriver.js';
import SocketDriver from './drivers/SocketDriver.js';

export * from './devices.js';
export * from './Animation.js';
export * from './drivers/Driver.js';
export const DRIVERS = [
  'null',
  'socketio',
  'dmx4all',
  'enttec-usb-dmx-pro',
  'enttec-open-usb-dmx',
  'dmxking-ultra-dmx-pro',
  'artnet',
  'bbdmx',
  'sacn',
];

export default class DMX extends EventEmitter {
  constructor() {
    super();

    this.universes = new Map();
    this.drivers = new Map();

    this.registerDriver('null', NullDriver);
    this.registerDriver('socketio', SocketDriver);
    this.registerDriver('dmx4all', DMX4AllDriver);
    this.registerDriver('enttec-usb-dmx-pro', EntTecUSBDMXProDriver);
    this.registerDriver('enttec-open-usb-dmx', EntTecOpenUsbDMXDriver);
    this.registerDriver('dmxking-ultra-dmx-pro', DMXKingUltraDmxProDriver);
    this.registerDriver('artnet', ArtNetDriver);
    this.registerDriver('bbdmx', BBDMXDriver);
    this.registerDriver('sacn', SACNDriver);
  }

  registerDriver(name, constructor) {
    this.drivers.set(name, constructor);
  }

  addUniverse(name, driver, options = {}) {
    if (this.universes.has(driver)) {
      throw new Error(`Universe ${driver} already exists`);
    }

    if (!this.drivers.has(driver)) {
      throw new Error(`Driver ${driver} does not exist`);
    }

    const Driver = this.drivers.get(driver);
    const instance = new Driver(options);

    this.universes.set(name, instance);

    return instance;
  }

  deleteUniverse(name) {
    const instance = this.universes.get(name);

    instance.stop();

    this.universes.delete(name);
  }

  deleteAllUniverse() {
    this.universes.forEach(name => this.deleteUniverse(name));
  }

  getUniverse(name) {
    if (!this.universes.has(name)) {
      throw new Error(`Universe ${name} does not exist`);
    }

    return this.universes.get(name);
  }

  getUniverses() {
    return Array.from(this.universes.keys());
  }

  getValue(universe, address) {
    return this.getUniverse(universe).get(address);
  }

  getValues(universe, begin, end) {
    return this.getUniverse(universe).toArray(begin, end);
  }

  setValue(universe, address, value) {
    return this.getUniverse(universe).set(address, value);
  }

  update(name, channels) {
    this.getUniverse(name).update(channels);
  }

  fill(name, value, begin, end) {
    this.getUniverse(name).fill(value, begin, end);
  }

  updateAll(name, value) {
    this.fill(name, value);
  }
}
