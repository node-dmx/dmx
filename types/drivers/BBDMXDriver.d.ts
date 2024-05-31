/// <reference types="node" resolution-mode="require"/>
export default class BBDMXDriver extends Driver {
    host: any;
    port: any;
    serial: dgram.Socket;
    ready: boolean;
}
import Driver from './index.js';
import dgram from 'dgram';
