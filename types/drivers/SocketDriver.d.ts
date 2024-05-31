export const PORT: 18909;
export default class SocketDriver extends Driver {
    socket: import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
}
import Driver from '.';
