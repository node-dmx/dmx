export const PORT: 18909;
export class SocketDriver extends AbstractDriver {
    constructor(options?: {});
    socket: import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
}

import {AbstractDriver} from './index.js';
