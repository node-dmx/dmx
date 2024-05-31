/// <reference types="node" />
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
import Driver from '.';
import dgram from 'dgram';
