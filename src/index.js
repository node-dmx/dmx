/**
 * @typedef {typeof import('./drivers/index.js').AbstractDriver} Driver
 * @typedef {import('@dmx-cloud/dmx-types').SerialDrivers} SerialDrivers
 */

import { EventEmitter } from 'events'
import { ArtNetDriver } from './drivers/ArtNetDriver.js'
import { BBDMXDriver } from './drivers/BBDMXDriver.js'
import { DMX4AllDriver } from './drivers/DMX4AllDriver.js'
import { DMXKingUltraDMXProDriver } from './drivers/DMXKingUltraDMXProDriver.js'
import { EntTecOpenUsbDMXDriver } from './drivers/EntTecOpenUsbDMXDriver.js'
import { EntTecUsbDMXProDriver } from './drivers/EntTecUsbDMXProDriver.js'
import { NullDriver } from './drivers/NullDriver.js'
import { SACNDriver } from './drivers/SACNDriver.js'
import { SocketDriver } from './drivers/SocketDriver.js'

/**
 * Available driver names.
 * @constant
 * @type {SerialDrivers}
 */
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

const DRIVER_CLASSES = {
  'null': NullDriver,
  'socketio': SocketDriver,
  'dmx4all': DMX4AllDriver,
  'enttec-usb-dmx-pro': EntTecUsbDMXProDriver,
  'enttec-open-usb-dmx': EntTecOpenUsbDMXDriver,
  'dmxking-ultra-dmx-pro': DMXKingUltraDMXProDriver,
  'artnet': ArtNetDriver,
  'bbdmx': BBDMXDriver,
  'sacn': SACNDriver,
}

export default class DMX extends EventEmitter {
  /**
   * Construct a new DMX instance.
   *
   * The constructor registers all available drivers.
   */
  constructor() {
    super()
    this.universes = new Map()
    this.drivers = new Map()

    // Register all drivers
    Object.entries(DRIVER_CLASSES).forEach(([name, driver]) => {
      this.registerDriver(name, driver)
    })
  }

  /**
   * Registers a new driver.
   * @param {string} name Driver name.
   * @param {Driver} constructor Driver constructor.
   */
  registerDriver(name, constructor) {
    this.drivers.set(name, constructor)
  }

  /**
   * Adds a new universe.
   * @param {string} id Universe ID.
   * @param {string} driver Driver name.
   * @param {object} [options={}] Driver options.
   * @returns {InstanceType<Driver>} Universe instance.
   */
  addUniverse(id, driver, options = {}) {
    this._ensureUniverseDoesNotExist(id)
    this._ensureDriverExists(driver)

    const Driver = this.drivers.get(driver)
    const instance = new Driver(options)

    this.universes.set(id, instance)

    return instance
  }

  /**
   * Deletes a universe.
   * @param {string} id Universe ID.
   */
  deleteUniverse(id) {
    this._ensureUniverseExists(id)
    const instance = this.universes.get(id)

    instance.stop()

    this.universes.delete(id)
  }

  /**
   * Deletes all universes.
   */
  deleteAllUniverses() {
    [...this.universes.keys()].forEach(id => this.deleteUniverse(id))
  }

  /**
   * Retrieves a universe.
   * @param {string} id Universe ID.
   * @returns {InstanceType<Driver>} Universe instance.
   */
  getUniverse(id) {
    this._ensureUniverseExists(id)

    return this.universes.get(id)
  }

  /**
   * Retrieves all universe IDs.
   * @returns {string[]} Universe IDs.
   */
  getUniverses() {
    return [...this.universes.keys()]
  }

  /**
   * Gets a value from a universe.
   * @param {string} id Universe ID.
   * @param {number} address Address.
   * @returns {number} Value.
   */
  getValue(id, address) {
    return this.getUniverse(id).get(address)
  }

  /**
   * Gets values from a universe.
   * @param {string} id Universe ID.
   * @param {number} [begin] Start address.
   * @param {number} [end] End address.
   * @returns {number[]} Values.
   */
  getValues(id, begin, end) {
    return this.getUniverse(id).toArray(begin, end)
  }

  /**
   * Sets a value in a universe.
   * @param {string} id Universe ID.
   * @param {number} address Address.
   * @param {number} value Value.
   */
  setValue(id, address, value) {
    this.getUniverse(id).set(address, value)
  }

  /**
   * Updates channels in a universe.
   * @param {string} id Universe ID.
   * @param {Record<number, number>} channels Channels.
   */
  update(id, channels) {
    this.getUniverse(id).update(channels)
  }

  /**
   * Fills a universe with a value.
   * @param {string} id Universe ID.
   * @param {number} value Value.
   * @param {number} [begin] Start address.
   * @param {number} [end] End address.
   */
  fill(id, value, begin, end) {
    this.getUniverse(id).fill(value, begin, end)
  }

  /**
   * Updates all channels in a universe.
   * @param {string} id Universe ID.
   * @param {number} value Value.
   */
  updateAll(id, value) {
    this.fill(id, value)
  }

  // Private helper methods

  /**
     * @param {string} id
     */
  _ensureUniverseExists(id) {
    if (!this.universes.has(id)) {
      throw new Error(`Universe ${id} does not exist`)
    }
  }

  /**
     * @param {string} id
     */
  _ensureUniverseDoesNotExist(id) {
    if (this.universes.has(id)) {
      throw new Error(`Universe ${id} already exists`)
    }
  }

  /**
     * @param {string} driver
     */
  _ensureDriverExists(driver) {
    if (!this.drivers.has(driver)) {
      throw new Error(`Driver ${driver} does not exist`)
    }
  }
}
