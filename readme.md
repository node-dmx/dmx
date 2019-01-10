# node-dmx

DMX-512 controller library for node.js

## Install

	npm install dmx

## Library API

	const DMX = require('dmx')

### Class DMX

#### new DMX()

Create a new DMX instance. This class is used to tie multiple universes together.

#### dmx.registerDriver(name, module)

- <code>name</code> - String
- <code>module</code> - Object implementing the Driver API


Register a new DMX Driver module by its name.
These drivers are currently registered by default:

- null: a development driver that prints the universe to stdout
- artnet: driver for EnttecODE
- bbdmx: driver for [BeagleBone-DMX](https://github.com/boxysean/beaglebone-DMX)
- dmx4all: driver for DMX4ALL devices like the "NanoDMX USB Interface"
- enttec-usb-dmx-pro: a driver for devices using a Enttec USB DMX Pro chip like the "DMXKing ultraDMX Micro".
- enttec-open-usb-dmx: driver for "Enttec Open DMX USB". This device is NOT recommended, there are known hardware limitations and this driver is not very stable. (If possible better obtain a device with the "pro" chip)
- dmxking-utra-dmx-pro: driver for the DMXKing Ultra DMX pro interface. This driver support multiple universe specify the options with Port = A or B

#### dmx.addUniverse(name, driver, device_id, options)

- <code>name</code> - String
- <code>driver</code> - String, referring a registered driver
- <code>device_id</code> - Number or Object
- <code>options</code> - Object, driver specific options

Add a new DMX Universe with a name, driver and an optional device_id used by the driver to identify the device.
For enttec-usb-dmx-pro and enttec-open-usb-dmx device_id is the path the the serial device. For artnet it is the target ip.

#### dmx.update(universe, channels)

- <code>universe</code> - String, name of the universe
- <code>channels</code> - Object, keys are channel numbers, values the values to set that channel to

Update one or multiple channels of a universe. Also emits a <code>update</code> Event with the same information.


#### DMX.devices

A JSON Object describing some Devices and how many channels they use.
Currently not many devices are in there but more can be added to the <code>devices.js</code> file. Pull requests welcome ;-)

The following Devices are known:

- generic - a one channel dimmer
- showtec-multidim2 - 4 channel dimmer with 4A per channel
- eurolite-led-bar - Led bar with 3 RGB color segments and some programms
- stairville-led-par-56 - RGB LED Par Can with some programms

### Class DMX.Animation

#### new DMX.Animation()

Create a new DMX Animation instance. This can be chained similar to jQuery.

#### animation.add(to, duration, options)

- <code>to</code> - Object, keys are channel numbers, values the values to set that channel to
- <code>duration</code> - Number, duration in ms
- <code>options</code> - Object

Add an animation Step.
The options Object takes an <code>easing</code> key which allows to set a easing function from the following list:

- linear (default)
- inQuad
- outQuad
- inOutQuad
- inCubic
- outCubic
- inOutCubic
- inQuart
- outQuart
- inOutQuart
- inQuint
- outQuint
- inOutQuint
- inSine
- outSine
- inOutSine
- inExpo
- outExpo
- inOutExpo
- inCirc
- outCirc
- inOutCirc
- inElastic
- outElastic
- inOutElastic
- inBack
- outBack
- inOutBack
- inBounce
- outBounce
- inOutBounce

Returns a Animation object with the animation step added.


#### animation.delay(duration)

- <code>duration</code> - Number, duration in ms

Delay the next animation step for duration.
Returns a Animation object with the delay step added.


#### animation.run(universe, onFinish)

- <code>universe</code> - Object, reference to the universe driver
- <code>onFinish</code> - Function, called when the animation is done

Run the Animation on the specified universe.


## Community

We're happy to help. Chat with us on IRC in #node-dmx on freenode.
