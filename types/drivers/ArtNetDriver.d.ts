/// <reference types="node" resolution-mode="require"/>
export default class ArtNetDriver extends Driver {
    header: Buffer;
    sequence: Buffer;
    physical: Buffer;
    length: Buffer;
    universeId: Buffer;
    host: any;
    port: any;
    socket: dgram.Socket;
    ready: boolean;
}
import Driver from './index.js';
import * as dgram from 'node:dgram';
