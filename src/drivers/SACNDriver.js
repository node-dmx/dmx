import sacn from 'sacn'
import Driver from './index.js'

export default class SACNDriver extends Driver {
  constructor(options = {}) {
    super(options)

    this.SACNServer = new sacn.Sender({
      universe: options.universe || 1,
      reuseAddr: true,
    })
  }

  close() {
    this.SACNServer.close()
  }

  update(values) {
    Driver.prototype.update.call(this, values)

    this.send().then()
  }

  send() {
    return this.SACNServer.send({
      payload: this.universe,
    })
  }

  updateAll(value) {
    Driver.prototype.updateAll.call(this, value)

    this.send().then()
  }
}
