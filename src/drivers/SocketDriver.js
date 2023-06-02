import io from 'socket.io-client';
import Driver from '../Driver.js';

export const PORT = 18909;

export default class SocketDriver extends Driver {
  constructor(options = {}) {
    super(options);

    this.socket = io.listen(options.port || PORT);

    this.socket.on('connection', () => {
      this.emit('ready');
      this.start();
    });

    this.socket.on('disconnect', () => {
      this.stop();
    });
  }
}
