export class ArtNetDriver extends AbstractDriver {
    constructor(options?: {});
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
import { AbstractDriver } from './index.js';
import * as dgram from 'node:dgram';
