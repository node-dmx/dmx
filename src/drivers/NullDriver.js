import Driver from '#drivers'
import console from 'node:console'

export default class NullDriver extends Driver {
  constructor(options = {}) {
    super(options)

    this.init()
  }

  send() {
    console.log(this.universe.subarray(1))
  }
}
