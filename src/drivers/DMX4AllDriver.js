/* global Buffer */
import SerialDriver from './SerialDriver.js'

const UNIVERSE_LEN = 512

export default class DMX4AllDriver extends SerialDriver {
  constructor(options = {}) {
    options.baudRate = 38400
    options.stopBits = 1

    super(options)
  }

  send() {
    if (!this.serial.writable || !this.ready) {
      return
    }

    this.ready = false

    const chunk = Buffer.alloc(UNIVERSE_LEN * 3)

    for (let i = 0; i < UNIVERSE_LEN; i++) {
      chunk[i * 3] = (i < 256) ? 0xE2 : 0xE3
      chunk[i * 3 + 1] = i
      chunk[i * 3 + 2] = this.universe[i + 1]
    }

    this.serial.write(chunk)
    this.serial.drain(() => {
      this.ready = true
    })
  }
}
