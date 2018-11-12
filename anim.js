"use strict"

var ease = require('./easing.js').ease
var resolution = 25

function Anim() {
	this.fx_stack = []
	this.interval = null
}

Anim.prototype.add = function(to, duration, options) {
	var options  = options  || {}
	var duration = duration || resolution
	options.easing = options.easing || 'linear';
	
	this.fx_stack.push({'to': to, 'duration': duration, 'options': options})
	return this
}

Anim.prototype.delay = function(duration) {
	return this.add({}, duration)
}

Anim.prototype.stop = function () {
	if(this.interval) {
		clearInterval(this.interval)
	}
	this.fx_stack = []
}

Anim.prototype.run = function(universe, onFinish) {
	var config = {}
	var ticks = 0
	var duration = 0
	var animationStep

	var fx_stack = this.fx_stack;
	var ani_setup = function() {
		animationStep = fx_stack.shift()
		ticks = 0
		duration = animationStep.duration

		config = {}
		for (var k in animationStep.to) {
			config[k] = {
				'start': universe.get(k),
				'end':   animationStep.to[k],
				'options': animationStep.options
			}
		}
	}
	var ani_step = function() {
		var newValues = {}
		for (var k in config) {
			var entry = config[k]
			var easing = ease[entry.options.easing]
			
			newValues[k] = Math.round(entry.start + easing(ticks, 0, 1, duration) * (entry.end - entry.start))
		}
		
		ticks = ticks + resolution
		universe.update(newValues)
		if (ticks > duration) {
			if (fx_stack.length > 0) {
				ani_setup()
			} else {
				clearInterval(iid)
				if(onFinish) {
					onFinish()
				}
			}
		}
	}

	ani_setup()
	var iid = this.interval = setInterval(ani_step, resolution)

	return this
}

module.exports = Anim
