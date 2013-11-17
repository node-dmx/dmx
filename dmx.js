"use strict"

var util = require('util')
var EventEmitter = require('events').EventEmitter

function DMX() {
	this.universes = {}
	this.drivers   = {}
	this.registerDriver('null',               require('./drivers/null'))
	this.registerDriver('enttec-usb-dmx-pro', require('./drivers/enttec-usb-dmx-pro'))
}

util.inherits(DMX, EventEmitter)

DMX.prototype.registerDriver = function(name, module) {
	this.drivers[name] = module
}

DMX.prototype.addUniverse = function(name, driver, device_id) {
	this.universes[name] = new this.drivers[driver](device_id)
}

DMX.prototype.update = function(universe, channels) {
	this.universes[universe].update(channels)
	this.emit('update', universe, channels)
}

module.exports = DMX
