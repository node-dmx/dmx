import { EventEmitter } from 'events';
import ArtnetDriver from './drivers/artnet.js';
import BBDMXDriver from './drivers/bbdmx.js';
import NullDriver from './drivers/null.js';
import Animation from './animation.js';
import DMX4ALLDriver from './drivers/dmx4all.js';
import DMXKingUltraDmxProDriver from './drivers/dmxking-ultra-dmx-pro.js';
import EntTecOpenUsbDMXDriver from './drivers/enttec-open-usb-dmx.js';
import EntTecUSBDMXPRODriver from './drivers/enttec-usb-dmx-pro.js';
import SACNDriver from './drivers/sacn.js';
import SocketIODriver from './drivers/socketio.js';
import devices from '../devices.js';

export default class DMX extends EventEmitter {
  constructor(options) {
    super();
    const opt = options || {};
    const devices = opt.devices || {};

    this.universes = {};
    this.drivers = {};
    this.devices = Object.assign({}, devices, devices);

    this.registerDriver('null', NullDriver);
    this.registerDriver('socketio', SocketIODriver);
    this.registerDriver('dmx4all', DMX4ALLDriver);
    this.registerDriver('enttec-usb-dmx-pro', EntTecUSBDMXPRODriver);
    this.registerDriver('enttec-open-usb-dmx', EntTecOpenUsbDMXDriver);
    this.registerDriver('dmxking-ultra-dmx-pro', DMXKingUltraDmxProDriver);
    this.registerDriver('artnet', ArtnetDriver);
    this.registerDriver('bbdmx', BBDMXDriver);
    this.registerDriver('sacn', SACNDriver);
  }

  registerDriver(name, module) {
    this.drivers[name] = module;
  }

  addUniverse(name, driver, deviceId, options) {
    this.universes[name] = new this.drivers[driver](deviceId, options);

    this.universes[name].on('update', (channels, extraData) => {
      this.emit('update', name, channels, extraData);
    });

    return this.universes[name];
  }

  update(universe, channels, extraData) {
    this.universes[universe].update(channels, extraData || {});
  }

  updateAll(universe, value) {
    this.universes[universe].updateAll(value);
    this.emit('updateAll', universe, value);
  }

  universeToObject(universeKey) {
    const universe = this.universes[universeKey];
    const u = {};

    for (let i = 0; i < 512; i++) {
      u[i] = universe.get(i);
    }

    return u;
  }
}

DMX.devices = devices;
DMX.Animation = Animation;
