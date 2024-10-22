// @ts-nocheck
// @typedef {import('@dmx-cloud/dmx-types').SerialDrivers} SerialDrivers
import { EventEmitter } from 'events'

export const DMX_MAX_CHANNELS = 512
export const INTERVAL = 50
export const EVENT_START = 'start'
export const EVENT_STOP = 'stop'
export const EVENT_READY = 'ready'

/**
 * @class AbstractDriver
 */
export class AbstractDriver extends EventEmitter {
  /**
   * Create a new driver instance.
   *
   * @param {any} options = {} - Driver options.
   * @param {number} [options.interval=50] The interval in milliseconds.
   */
  constructor(options = {}) {
    super(options)

    /**
     *
     * @type {Buffer}
     * @protected
     */
    this.universe = Buffer.alloc(DMX_MAX_CHANNELS + 1, 0)

    /**
     *
     * @type {number}
     * @protected
     */
    this.interval = 1000 / (options.interval ?? INTERVAL)
    /**
     *
     * @type {NodeJS.Timeout}
     * @protected
     */
    this.timeout = undefined
  }

  /**
   * Initializes the driver. This will either log an error and do nothing, or
   * emit the `ready` event and start calling `send` at the interval set by
   * `interval`.
   *
   * @param {?any} error - An error to log if the driver can't be initialized.
   */
  init(error) {
    if (error) {
      console.error(error)
    } else {
      this.emit(EVENT_READY)
      this.start()
    }
  }

  /**
   * Starts the driver. This will start calling `send` at the interval that was
   * specified in the constructor, and emit the `start` event.
   */
  start() {
    this.timeout = setInterval(this.send.bind(this), this.interval)

    this.emit(EVENT_START)
  }

  /**
   * Stops the driver. This will clear the interval that was calling
   * `send` and emit the `stop` event.
   */
  stop() {
    this.timeout != null && clearInterval(this.timeout)

    this.emit(EVENT_STOP)
  }

  /**
   * Gets the value of a DMX channel.
   *
   * @param {number} address The address of the DMX channel to get.
   *
   * @returns {number} The value of the DMX channel.
   */
  get(address) {
    return this.universe[address]
  }

  /**
   * Sets the value of a DMX channel.
   *
   * @param {number} address The address of the DMX channel to set.
   * @param {number} value The value to set the DMX channel to.
   *
   * @returns {void}
   */
  set(address, value) {
    this.universe[address] = value
  }

  /**
   * Converts the value of the DMX channel at the given address to a percentage.
   *
   * @param {number} address The address of the DMX channel.
   * @returns {number} The percentage that the DMX channel is at.
   */
  getPercent(address) {
    return (this.get(address) / DMX_MAX_CHANNELS) * 100
  }

  /**
   * Converts the DMX universe to an array, optionally starting and ending at
   * the specified addresses.
   *
   * @param {number} [begin=1] The starting address of the range of values to
   *     convert. If omitted, the values will start from address 1.
   * @param {number} [end=this.universe.length] The ending address of the range
   * of values to convert. If omitted, the values will end at the highest
   * address supported by the universe.
   * @return {number[]} The values of the DMX channels in the specified range.
   */
  toArray(begin = 1, end = this.universe.length) {
    return [...this.universe.subarray(begin, end)]
  }

  /**
   * Updates multiple DMX channels with new values.
   *
   * @param {Record<number, number> | {}} values An object where the keys are DMX
   * channel addresses and the values are the new values for those channels.
   */
  update(values) {
    for (const address in values) {
      this.universe[address] = values[address]
    }
  }

  /**
   * Fills a range of DMX channels with the same value.
   *
   * @param {number} value The value to fill the DMX channels with.
   * @param {number} [begin=1] The starting address of the range of values to
   *     fill. If omitted, the values will start from address 1.
   * @param {number} [end=this.universe.length] The ending address of the range
   * of values to fill. If omitted, the values will end at the highest address
   *     supported by the universe.
   */
  fill(value, begin = 1, end = this.universe.length) {
    this.universe.fill(value, begin, end)
  }

  /**
   * Sets all DMX channels to the same value.
   * @param {number} value The value to set all channels to.
   */
  updateAll(value) {
    this.fill(value)
  }

  /**
   * Sends the current universe values to the underlying driver.
   *
   * Must be overridden by the driver.
   */
  send() {
  }
}
