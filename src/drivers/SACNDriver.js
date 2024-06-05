import { Sender } from 'sacn'
import { AbstractDriver } from './index.js'

export class SACNDriver extends AbstractDriver {
  constructor(options = {}) {
    super(options)

    this.SACNServer = new Sender({
      universe: options.universe || 1,
      reuseAddr: true,
    })
  }

  stop() {
    this.SACNServer.close()
  }

  /**
   *
   * @param {Record<number, number>} values
   */
  update(values) {
    AbstractDriver.prototype.update.call(this, values)

    this.send().then()
  }

  send() {
    return this.SACNServer.send({
      payload: this.universe,
    })
  }

  /**
   *
   * @param {number} value
   */
  updateAll(value) {
    AbstractDriver.prototype.updateAll.call(this, value)

    this.send().then()
  }
}
