"use strict";

var Edge = require('edge');

function EnttecOpenUsbDMX(locationId, cb) {
    var self = this;

    cb = cb || function () {
    };
    self.universe = new Buffer(513);
    self.universe[0] = 0;
    self.updateAll(0);
    self.sleepTime = 25;
    self.timeout = null;
    self.device = Edge.func(require('path').join(__dirname, './enttec-open-usb-cs/openDmx.cs'));

    cb(self.open());
}

EnttecOpenUsbDMX.prototype.open = function () {
    var self = this;
    //TODO: find device by VID and PID to not open ANY device connected
    //vendorId: 1027
    //productId: 24577
    self.device({
        func: 'open'
    }, function(){
      self.loopUniverse()
    });

    //TODO: return real status
    return null;
};

EnttecOpenUsbDMX.prototype.loopUniverse = function () {
    var self = this;
    clearTimeout(self.timeout);

    self.device({
        func: 'write_universe',
        universe: self.universe
    }, function(){
        self.device({
            func: 'send_buffer'
        })
    });

    self.timeout = setTimeout(function () {
        self.loopUniverse();
    }, self.sleepTime)
};

EnttecOpenUsbDMX.prototype.pause = function () {
    var self = this;

    clearTimeout(self.timeout);
};

EnttecOpenUsbDMX.prototype.close = function (cb) {
    var self = this;

    self.pause();
//    TODO:
//    self.device({
//      func: 'close'
//    })
};

EnttecOpenUsbDMX.prototype.update = function (u) {
    var self = this;

    for (var c in u) {
        var channel = parseInt(c) + 1;
        //var value = parseInt(u[c], 10).toString(16);
        var value = u[c];
        self.universe[channel] = value;
    }
};

EnttecOpenUsbDMX.prototype.updateAll = function (v) {
    var self = this;

    var i = 1;
    while (i < self.universe.length) {
        self.universe[i] = v;
        i++;
    }
};

EnttecOpenUsbDMX.prototype.get = function (c) {
    var self = this;
    c = parseInt(c);
    return self.universe[(c + 1)];
};

module.exports = EnttecOpenUsbDMX;
