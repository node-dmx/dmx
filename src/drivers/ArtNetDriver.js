import * as dgram from 'node:dgram'
import { AbstractDriver } from './index.js'

const HOST = '127.0.0.1'
const PORT = 6454

export class ArtNetDriver extends AbstractDriver {
  constructor(options = {}) {
    super()
    this.header = Buffer.from([ 65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14 ])
    this.sequence = Buffer.from([ 0 ])
    this.physical = Buffer.from([ 0 ])
    this.length = Buffer.from([ 0x02, 0x00 ])
    this.universeId = Buffer.from([ 0x00, 0x00 ])
    this.universeId.writeInt16LE(options.universe || 0, 0)
    this.host = options.host || HOST
    this.port = options.port || PORT
    this.socket = dgram.createSocket('udp4')
    this.ready = true

    this.socket.bind(() => {
      this.socket.setBroadcast(true)
      this.init()
    })
  }

  send() {
    const buffer = Buffer.concat([
      this.header,
      this.sequence,
      this.physical,
      this.universeId,
      this.length,
      this.universe.subarray(1),
    ])

    if (this.ready) {
      this.ready = false

      this.socket.send(buffer, 0, buffer.length, this.port, this.host, () => {
        this.ready = true
      })
    }
  }
}
