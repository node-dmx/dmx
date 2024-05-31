import { EventEmitter } from 'events'
import { clearInterval, setInterval } from 'node:timers'

export const DMX_MAX_CHANNELS = 512
export const INTERVAL = 50
export const EVENT_START = 'start'
export const EVENT_STOP = 'stop'
export const EVENT_READY = 'ready'

export default class Driver extends EventEmitter {
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
   *
   * @param {Error} [error]
   */
  init(error) {
    if (error) {
      console.error(error)
    } else {
      this.emit(EVENT_READY)
      this.start()
    }
  }

  start() {
    this.timeout = setInterval(this.send.bind(this), this.interval)

    this.emit(EVENT_START)
  }

  stop() {
    this.timeout != null && clearInterval(this.timeout)

    this.emit(EVENT_STOP)
  }

  /**
   *
   * @param {number} address
   * @return {number}
   */
  get(address) {
    return this.universe[address]
  }

  /**
   *
   * @param {number} address
   * @param {number} value
   */
  set(address, value) {
    this.universe[address] = value
  }

  /**
   *
   * @param {number} address
   * @return {number}
   */
  getPercent(address) {
    return (this.get(address) / DMX_MAX_CHANNELS) * 100
  }

  /**
   *
   * @param {number} [begin=1]
   * @param {number} [end=this.universe.length]
   * @return {number[]}
   */
  toArray(begin = 1, end = this.universe.length) {
    return Array.from(this.universe.subarray(begin, end))
  }

  /**
   *
   * @param {Record<number, number>} values
   */
  update(values) {
    for (const address in values) {
      this.universe[address] = values[address]
    }
  }

  /**
   *
   * @param {number} value
   * @param {number} [begin=1]
   * @param {number} [end=this.universe.length]
   */
  fill(value, begin = 1, end = this.universe.length) {
    this.universe.fill(value, begin, end)
  }

  /**
   *
   * @param {number} value
   */
  updateAll(value) {
    this.fill(value)
  }

  send() {
  }
}
