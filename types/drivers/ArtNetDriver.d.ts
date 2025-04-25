export class ArtNetDriver extends AbstractDriver {
    constructor(options?: {});
    header: Buffer<ArrayBuffer>;
    sequence: Buffer<ArrayBuffer>;
    physical: Buffer<ArrayBuffer>;
    length: Buffer<ArrayBuffer>;
    universeId: Buffer<ArrayBuffer>;
    host: any;
    port: any;
    socket: dgram.Socket;
    ready: boolean;
}

import * as dgram from 'node:dgram'
import {AbstractDriver} from './index.js'
