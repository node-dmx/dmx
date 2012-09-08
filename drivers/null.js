exports.init = function(dev_id) {
	var universe = new Buffer(512)
	universe.fill(0)
	
	this.update = function(u) {
		for(var k in u) {
			universe[k] = u[k]
		}
	}

	this.get = function(k) {
		return universe[k];
	}

	setInterval(function() {
		console.log(universe);
	}, 1000);
	return this;
}
