/// <reference types="node" />
export default class BBDMXDriver extends Driver {
    host: any;
    port: any;
    serial: dgram.Socket;
    ready: boolean;
}
import Driver from '.';
import dgram from 'dgram';
