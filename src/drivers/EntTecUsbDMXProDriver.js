import { SerialDriver } from './SerialDriver.js'

const ENTTEC_PRO_DMX_START_CODE = 0x00
const ENTTEC_PRO_START_OF_MSG = 0x7e
const ENTTEC_PRO_END_OF_MSG = 0xe7
const ENTTEC_PRO_SEND_DMX_RQ = 0x06

export class EntTecUsbDMXProDriver extends SerialDriver {
  send() {
    if (!this.serial.writable || !this.ready) {
      return
    }

    const header = Buffer.from([
      ENTTEC_PRO_START_OF_MSG,
      ENTTEC_PRO_SEND_DMX_RQ,
      (this.universe.length) & 0xff,
      ((this.universe.length) >> 8) & 0xff,
      ENTTEC_PRO_DMX_START_CODE,
    ])

    const msg = Buffer.concat([
      header,
      this.universe.subarray(1),
      Buffer.from([ ENTTEC_PRO_END_OF_MSG ]),
    ])

    this.ready = false
    this.serial.write(msg)
    this.serial.drain(() => {
      this.ready = true
    })
  }
}
