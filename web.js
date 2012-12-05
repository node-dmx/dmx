var http  = require('http'),
	path = require('path'),
	io   = require('socket.io'),
	fs   = require('fs')
	;

exports.init = function(dmx) {
	function handler (request, response) {
		var reqBody = '';
	
		request.on("data", function (chunk) {
			reqBody += chunk;
		});
		
		request.on("end", function () {
			var filePath = '.' + request.url;
			if (filePath == './')
				filePath = './index.html';

			var extname = path.extname(filePath);
			var contentType = 'text/html';
			switch (extname) {
				case '.js':	 contentType = 'text/javascript'; break;
				case '.css': contentType = 'text/css';        break;
			}

			fs.exists(filePath, function(exists) {
				if(!exists) {
					console.log('404: ' + request.url)
					response.writeHead(404);
					response.end();
					return;
				}

				fs.readFile(filePath, function(error, content) {
					if (error) {
						console.log('500: ' + request.url)
						response.writeHead(500);
						response.end();
						return;
					}

					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				});
			});
		});
	}


	var app = http.createServer(handler)
	app.listen(setup.port, '::', null, function() {
		try {
			process.setuid(setup.uid);
			process.setgid(setup.gid);
		} catch (err) {
			console.log(err);
			process.exit(1);
		}
	});

	io.listen(app).sockets.on('connection', function (socket) {
		socket.emit('init', {'devices': dmx.devices, 'setup': dmx.setup});
		socket.on('request_refresh', function() {
			for(var universe in dmx.setup.universes) {
				u = {}
				for(var i = 0; i < 256; i++) {
					u[i] = dmx.drivers[universe].get(i);
				}
				console.log('sending update...')
				console.log(u)
				socket.emit('update', universe, u);
			}
		});
		
		dmx.on('update', function(universe, update){
		    socket.emit('update', universe, update);
		});
		
		socket.on('update', function(universe, update) {
			dmx.update(universe, update);
		});
	});
}	






