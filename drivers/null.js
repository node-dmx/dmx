"use strict"

function Null(device_id, cb) {
	var self = this
	cb = cb || function() {}
	this.universe = new Buffer(512)
	this.universe.fill(0)
}

Null.prototype.update = function(u) {
	for(var c in u) {
		this.universe[c] = u[c]
	}
	console.log(this.universe)
}

Null.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = Null