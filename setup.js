// listen port
exports.port = 80;

// uid and gid to drop root priv.
exports.uid = 'light';
exports.gid = 'users';

// setup devices
exports.setup = {
	presets: [
		{
			label: 'White',
			values: {
				'office': { 0:16,  1:255,  2:0,  3:255,  4: 255,  5:255, 15:16, 16:255, 17:0, 18:255, 19: 255, 20:255 }
			}
		},
		{
			label: 'Natural',
			values: {
				'office': { 0:16,  1:255,  2:0,  3:255,  4: 190,  5:140, 15:16, 16:255, 17:0, 18:255, 19: 190, 20:140 }
			}
		},
		{
			label: 'Worklight',
			values: {
				'office': { 0:16,  1:130,  2:0,  3:255,  4: 165,  5:0, 15: 1, 16:255, 17:0, 18:255, 19: 190, 20:140, 21:0, 22: 0, 23:0, 24:255, 25: 190, 26:140 }
			}
		}
	],
	universes: {
		'office': {
			'output': {
				'driver': 'enttec-usb-dmx-pro',
				'device': 0
			},
			'devices': [
				{
					'type': 'eurolite-led-bar',
					'address': 0
				},
				{
					'type': 'eurolite-led-bar',
					'address': 15
				}
			]
		}
	}
}
