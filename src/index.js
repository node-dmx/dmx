import { EventEmitter } from 'events'
import ArtNetDriver from './drivers/ArtNetDriver.js'
import BBDMXDriver from './drivers/BBDMXDriver.js'
import DMX4AllDriver from './drivers/DMX4AllDriver.js'
import DMXKingUltraDmxProDriver from './drivers/DMXKingUltraDMXProDriver.js'
import EntTecOpenUsbDMXDriver from './drivers/EntTecOpenUsbDMXDriver.js'
import EntTecUSBDMXProDriver from './drivers/EntTecUsbDMXProDriver.js'
import NullDriver from './drivers/NullDriver.js'
import SACNDriver from './drivers/SACNDriver.js'
import SocketDriver from './drivers/SocketDriver.js'

export * from './devices.js'
export * from './Animation.js'
export * from './drivers/Driver.js'
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
]

export default class DMX extends EventEmitter {
  constructor() {
    super()

    this.universes = new Map()
    this.drivers = new Map()

    this.registerDriver('null', NullDriver)
    this.registerDriver('socketio', SocketDriver)
    this.registerDriver('dmx4all', DMX4AllDriver)
    this.registerDriver('enttec-usb-dmx-pro', EntTecUSBDMXProDriver)
    this.registerDriver('enttec-open-usb-dmx', EntTecOpenUsbDMXDriver)
    this.registerDriver('dmxking-ultra-dmx-pro', DMXKingUltraDmxProDriver)
    this.registerDriver('artnet', ArtNetDriver)
    this.registerDriver('bbdmx', BBDMXDriver)
    this.registerDriver('sacn', SACNDriver)
  }

  registerDriver(name, constructor) {
    this.drivers.set(name, constructor)
  }

  addUniverse(id, driver, options = {}) {
    if (this.universes.has(id)) {
      throw new Error(`Universe ${id} already exists`)
    }

    if (!this.drivers.has(driver)) {
      throw new Error(`Driver ${driver} does not exist`)
    }

    const Driver = this.drivers.get(driver)
    const instance = new Driver(options)

    this.universes.set(id, instance)

    return instance
  }

  deleteUniverse(id) {
    if (!this.universes.has(id)) {
      throw new Error(`Universe ${id} does not exist`)
    }

    const instance = this.universes.get(id)

    instance.stop()

    this.universes.delete(id)
  }

  deleteAllUniverses() {
    Array
      .from(this.universes.keys())
      .forEach(name => this.deleteUniverse(name))
  }

  getUniverse(id) {
    if (!this.universes.has(id)) {
      throw new Error(`Universe ${id} does not exist`)
    }

    return this.universes.get(id)
  }

  getUniverses() {
    return Array.from(this.universes.keys())
  }

  getValue(id, address) {
    return this.getUniverse(id).get(address)
  }

  getValues(id, begin, end) {
    return this.getUniverse(id).toArray(begin, end)
  }

  setValue(id, address, value) {
    this.getUniverse(id).set(address, value)
  }

  update(id, channels) {
    this.getUniverse(id).update(channels)
  }

  fill(id, value, begin, end) {
    this.getUniverse(id).fill(value, begin, end)
  }

  updateAll(id, value) {
    this.fill(id, value)
  }
}
