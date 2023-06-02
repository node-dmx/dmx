import SerialDriver from './SerialDriver.js';

export default class EntTecOpenUsbDMXDriver extends SerialDriver {
  send() {
    if (!this.serial.writable || !this.ready) {
      return;
    }

    this.serial.set({brk: true, rts: true}, () => {
      this.serial.set({brk: false, rts: true}, () => {
        if (this.ready) {
          this.ready = false;
          this.serial.write(Buffer.from([0, ...this.universe.subarray(1)]));
          this.serial.drain(() => {
            this.ready = true;
          });
        }
      });
    });
  }
}
