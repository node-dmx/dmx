import { EventEmitter } from 'events'
import console from 'node:console'
import { clearInterval, setInterval } from 'node:timers'

export const DMX_MAX_CHANNELS = 512
export const INTERVAL = 50
export const EVENT_START = 'start'
export const EVENT_STOP = 'stop'
export const EVENT_READY = 'ready'

export default class Driver extends EventEmitter {
  constructor(options = {}) {
    super(options)

    this.universe = Buffer.alloc(DMX_MAX_CHANNELS + 1, 0)
    this.interval = 1000 / (options.interval ?? INTERVAL)
    this.timeout = null
  }

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

  get(address) {
    return this.universe[address]
  }

  set(address, value) {
    this.universe[address] = value
  }

  getPercent(address) {
    return (this.get(address) / DMX_MAX_CHANNELS) * 100
  }

  toArray(begin = 1, end = this.universe.length) {
    return Array.from(this.universe.subarray(begin, end))
  }

  update(values) {
    for (const address in values) {
      this.universe[address] = values[address]
    }
  }

  fill(value, begin = 1, end = this.universe.length) {
    this.universe.fill(value, begin, end)
  }

  updateAll(value) {
    this.fill(value)
  }

  send() {
  }
}
