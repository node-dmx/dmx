import { AbstractDriver } from './index.js'

export class NullDriver extends AbstractDriver {
  constructor(options = {}) {
    super(options)

    this.init()
  }

  send() {
    console.log(this.universe.subarray(1))
  }
}
