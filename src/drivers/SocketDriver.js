import { default as io } from 'socket.io-client'
import { AbstractDriver } from './index.js'

export const PORT = 18909

export class SocketDriver extends AbstractDriver {
  constructor(options = {}) {
    super(options)

    this.socket = io(options.port || PORT)

    this.socket.on('connection', () => {
      this.emit('ready')
      this.start()
    })

    this.socket.on('disconnect', () => {
      this.stop()
    })
  }
}
