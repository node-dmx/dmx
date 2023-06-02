import Driver from '../Driver.js';

export default class NullDriver extends Driver {
  constructor(options = {}) {
    super(options);

    this.init();
  }

  send() {
    console.log(this.universe.subarray(1));
  }
}
