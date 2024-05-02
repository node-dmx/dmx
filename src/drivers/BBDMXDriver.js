/* global Buffer */
import dgram from 'dgram'
import Driver, { DMX_MAX_CHANNELS } from './Driver.js'

const HOST = '127.0.0.1'
const PORT = 9930

export default class BBDMXDriver extends Driver {
  constructor(options = {}) {
    super(options)

    this.host = options.host || HOST
    this.port = options.port || PORT
    this.serial = dgram.createSocket('udp4')

    this.init()
  }

  send() {
    if (!this.ready) {
      return
    }

    this.ready = false
    let channel
    let message = Buffer.from(DMX_MAX_CHANNELS.toString())

    for (let i = 1; i <= DMX_MAX_CHANNELS; i++) {
      channel = Buffer.from(' ' + this.universe[i])
      message = Buffer.concat([ message, channel ])
    }

    this.serial.send(message, 0, message.length, this.port, this.host, () => {
      this.ready = true
    })
  }
}
