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

export * from './Driver.js';
export { default as devices } from './devices.js';
export { default as Animation } from './Animation.js';

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
    const Driver = this.drivers.get(driver);
    const instance = new Driver(options);

    this.universes.set(name, instance);

    return instance;
  }

  getUniverse(name) {
    return this.universes.get(name);
  }

  getUniverses() {
    return Array.from(this.universes.keys());
  }

  update(name, channels) {
    this.getUniverse(name).update(channels);
  }

  updateAll(name, value) {
    this.getUniverse(name).updateAll(value);
  }
}
