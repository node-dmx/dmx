"use strict"

var DMX = require('./dmx');

var dmx = new DMX();
var A = dmx.animation;

// var universe = dmx.addUniverse('demo', 'enttec-open-usb-dmx', '/dev/cu.usbserial-6AVNHXS8')
var universe = dmx.addUniverse('demo', 'null')

var on = false;
setInterval(function(){
  if(on){
    on = false;
    universe.updateAll(0);
    console.log("off");
  }else{
    on = true;
    universe.updateAll(250);
    console.log("on");
  }
}, 1000);
