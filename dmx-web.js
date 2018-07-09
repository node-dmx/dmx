#!/usr/bin/env node
"use strict"

var fs       = require('fs')
var http     = require('http')
var body     = require('body-parser')
var express  = require('express')
var socketio = require('socket.io')
var program  = require('commander')
var DMX      = require('./dmx')
var A        = DMX.Animation

program
	.version("0.0.1")
	.option('-c, --config <file>', 'Read config from file [/etc/dmx-web.json]', '/etc/dmx-web.json')
	.parse(process.argv)


var	config = JSON.parse(fs.readFileSync(program.config, 'utf8'))

function DMXWeb() {
	var app    = express()
	var server = http.createServer(app)
	var io     = socketio.listen(server)

	var dmx = new DMX()

	for(var universe in config.universes) {
		dmx.addUniverse(
			universe,
			config.universes[universe].output.driver,
			config.universes[universe].output.device,
			config.universes[universe].output.options
		)
	}

	var listen_port = config.server.listen_port || 8080
	var listen_host = config.server.listen_host || '::'

	server.listen(listen_port, listen_host, null, function() {
		if(config.server.uid && config.server.gid) {
			try {
				process.setuid(config.server.uid)
				process.setgid(config.server.gid)
			} catch (err) {
				console.log(err)
				process.exit(1)
			}
		}
	})

	app.use(body.json())

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/index.html')
	})

	app.get('/config', function(req, res) {
		var response = {"devices": DMX.devices, "universes": {}}
		Object.keys(config.universes).forEach(function(key) {
			response.universes[key] = config.universes[key].devices
		})

		res.json(response)
	})

	app.get('/state/:universe', function(req, res) {
		if(!(req.params.universe in dmx.universes)) {
			res.status(404).json({"error": "universe not found"})
			return
		}

		res.json({"state": dmx.universeToObject(req.params.universe)})
	})

	app.post('/state/:universe', function(req, res) {
		if(!(req.params.universe in dmx.universes)) {
			res.status(404).json({"error": "universe not found"})
			return
		}

		dmx.update(req.params.universe, req.body)
		res.json({"state": dmx.universeToObject(req.params.universe)})
	})

	app.post('/animation/:universe', function(req, res) {
		try {
			var universe = dmx.universes[req.params.universe]

			// preserve old states
			var old = dmx.universeToObject(req.params.universe)

			var animation = new A()
			for(var step in req.body) {
				animation.add(
					req.body[step].to,
					req.body[step].duration || 0,
					req.body[step].options  || {}
				)
			}
			animation.add(old, 0)
			animation.run(universe)
			res.json({"success": true})
		} catch(e) {
			console.log(e)
			res.json({"error": String(e)})
		}
	})

	io.sockets.on('connection', function(socket) {
		socket.emit('init', {'devices': DMX.devices, 'setup': config})

		socket.on('request_refresh', function() {
			for(var universe in config.universes) {
				socket.emit('update', universe, dmx.universeToObject(universe))
			}
		})

		socket.on('update', function(universe, update) {
			dmx.update(universe, update)
		})

		dmx.on('update', function(universe, update) {
			socket.emit('update', universe, update)
		})
	})
}

DMXWeb()
