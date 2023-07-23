module.exports = {
  'generic': {
    channels: ['dimmer'],
  },
  'generic-rgb': {
    channels: ['red', 'green', 'blue'],
  },
  'showtec-multidim2': {
    channels: ['1', '2', '3', '4'],
  },
  'eurolite-led-bar': {
    channels: [
      'ctrl',
      'dimmer',
      'strobe',
      'red0',
      'green0',
      'blue0',
      'red1',
      'green1',
      'blue1',
      'red2',
      'green2',
      'blue2',
    ],
    ranges: {
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'Black Out' },
          { 'value': 1, 'label': 'Dimmer 1' },
          { 'value': 16, 'label': 'Dimmer 2' },
          { 'value': 32, 'label': 'Red' },
          { 'value': 48, 'label': 'Green' },
          { 'value': 64, 'label': 'Blue' },
          { 'value': 80, 'label': 'Purple' },
          { 'value': 96, 'label': 'Yellow' },
          { 'value': 112, 'label': 'Cyan' },
          { 'value': 128, 'label': 'White' },
          { 'value': 144, 'label': 'Color change' },
          { 'value': 160, 'label': 'Color flow' },
          { 'value': 176, 'label': 'Color dream' },
          { 'value': 192, 'label': 'Multi flow' },
          { 'value': 208, 'label': 'Dream flow' },
          { 'value': 224, 'label': 'Two color flow' },
          { 'value': 240, 'label': 'Sound activity' },
        ],
      },
      'dimmer': {
        'type': 'slider',
        'min': 0,
        'max': 255,
      },
    },
  },
  'stairville-led-par-56': {
    channels: ['ctrl', 'red', 'green', 'blue', 'speed'],
    ranges: {
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'RGB Control' },
          { 'value': 64, 'label': '7 color fade' },
          { 'value': 128, 'label': '7 color change' },
          { 'value': 192, 'label': '3 color change' },
        ],
      },
    },
  },
  'ultra-pro-24ch-rdm': {
    channels: [...Array(25).keys()].slice(1),
  },
  'ultra-pro-6rgbch-rdm': {
    channels: [...Array(25).keys()].slice(1),
    channelgroups: ['1', '2', '3', '4', '5', '6'],
  },
  'oppsk-cob-uv-par': {
    channels: ['dimmer', 'strobe', 'program-speed', 'sound-activity'],
  },
  'lixda-par12-led': {
    channels: ['ctrl', 'static-color', 'speed', 'dimmer', 'red', 'green', 'blue', 'white'],
    ranges: {
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'Off' },
          { 'value': 11, 'label': 'Static Color' },
          { 'value': 51, 'label': 'Jump' },
          { 'value': 101, 'label': 'Gradual' },
          { 'value': 151, 'label': 'Sound Activate' },
          { 'value': 200, 'label': 'Strobe' },
        ],
      },
      'static-color': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'All Color' },
          { 'value': 40, 'label': 'Red' },
          { 'value': 50, 'label': 'Green' },
          { 'value': 60, 'label': 'Blue' },
          { 'value': 70, 'label': 'Yellow' },
          { 'value': 80, 'label': 'Cyan' },
          { 'value': 90, 'label': 'Purple' },
          { 'value': 100, 'label': 'White' },
          { 'value': 110, 'label': 'Red + Green' },
          { 'value': 120, 'label': 'Red + Blue' },
          { 'value': 130, 'label': 'Red + White' },
          { 'value': 140, 'label': 'Green + Blue' },
          { 'value': 150, 'label': 'Green + White' },
          { 'value': 160, 'label': 'Blue + White' },
          { 'value': 170, 'label': 'Red + Green + White' },
          { 'value': 180, 'label': 'Red + Blue + White' },
          { 'value': 190, 'label': 'Green + Blue + White' },
          { 'value': 200, 'label': 'Red + Green + Blue' },
          { 'value': 210, 'label': 'Red + Green + Blue + White' },
        ],
      },
    },
  },
  'lixada-par12-led-v2': {
    channels: ['dimmer', 'red', 'green', 'blue', 'white', 'strobe', 'ctrl', 'speed'],
    ranges: {
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'Off' },
          { 'value': 11, 'label': 'Static Color' },
          { 'value': 61, 'label': 'Gradient slow' },
          { 'value': 85, 'label': 'Gradient medium' },
          { 'value': 110, 'label': 'Gradient fast' },
          { 'value': 111, 'label': 'Pulse slow' },
          { 'value': 135, 'label': 'Pulse medium' },
          { 'value': 160, 'label': 'Pulse fast' },
          { 'value': 161, 'label': 'Jump slow' },
          { 'value': 185, 'label': 'Jump medium' },
          { 'value': 210, 'label': 'Jump fast' },
          { 'value': 211, 'label': 'Sound Activate' },
        ],
      },
    },
  },
  'eurolite-led-tha-120PC': {
    channels: ['red', 'green', 'blue', 'white', 'dimmer', 'strobe', 'effect'],
  },
  'briteq-bt-theatre-60FC': {
    channels: ['dimmer', 'strobe', 'effect', 'red', 'green', 'blue', 'white'],
  },
  'lalucenatz-led-4ch': {
    channels: ['master', 'red', 'green', 'blue'],
  },
  'fungeneration-led-pot-12x1w-qcl-rgbww-4ch': {
    channels: ['red', 'green', 'blue', 'white'],
  },
  'fungeneration-led-pot-12x1w-qcl-rgbww-6ch': {
    channels: ['dimmer', 'red', 'green', 'blue', 'white', 'strobe'],
  },
  'fungeneration-led-pot-12x1w-qcl-rgbww-8ch': {
    channels: ['dimmer', 'red', 'green', 'blue', 'white', 'programme-selection', 'colour-macros-programme-01', 'strobe'],
    ranges: {
      'programme-selection': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 1, 'label': 'Programme 01' },
          { 'value': 17, 'label': 'Programme 02' },
          { 'value': 34, 'label': 'Programme 03' },
          { 'value': 51, 'label': 'Programme 04' },
          { 'value': 68, 'label': 'Programme 05' },
          { 'value': 85, 'label': 'Programme 06' },
          { 'value': 102, 'label': 'Programme 07' },
          { 'value': 119, 'label': 'Programme 08' },
          { 'value': 136, 'label': 'Programme 09' },
          { 'value': 153, 'label': 'Programme 10' },
          { 'value': 170, 'label': 'Programme 11' },
          { 'value': 187, 'label': 'Programme 12' },
          { 'value': 204, 'label': 'Programme 13' },
          { 'value': 221, 'label': 'Programme 14' },
          { 'value': 238, 'label': 'Programme Sound-controlled-operation' },
        ],
      },
      'colour-macros-programme-01': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'Red 0 % / Green 0 % / Blue 0 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 16, 'label': 'Red 255 % / Green 0 % / Blue 0 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 32, 'label': 'Red 0 % / Green 255 % / Blue 0 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 48, 'label': 'Red 0 % / Green 0 % / Blue 255 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 64, 'label': 'Red 0 % / Green 0 % / Blue 0 % / White 255 %, if channel 6 = 1 ... 16' },
          { 'value': 80, 'label': 'Red 255 % / Green 150 % / Blue 0 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 96, 'label': 'Red 255 % / Green 180 % / Blue 0 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 112, 'label': 'Red 255 % / Green 255 % / Blue 0 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 128, 'label': 'Red 255 % / Green 0 % / Blue 255 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 144, 'label': 'Red 255 % / Green 0 % / Blue 140 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 160, 'label': 'Red 0 % / Green 255 % / Blue 255 % / White 0 %, if channel 6 = 1 ... 16' },
          { 'value': 176, 'label': 'Red 255 % / Green 0 % / Blue 0 % / White 210 %, if channel 6 = 1 ... 16' },
          { 'value': 192, 'label': 'Red 0 % / Green 255 % / Blue 0 % / White 210 %, if channel 6 = 1 ... 16' },
          { 'value': 208, 'label': 'Red 0 % / Green 0 % / Blue 255 % / White 210 %, if channel 6 = 1 ... 16' },
          { 'value': 224, 'label': 'Red 255 % / Green 200 % / Blue 40 % / White 90 %, if channel 6 = 1 ... 16' },
          { 'value': 240, 'label': 'Red 255 % / Green 255 % / Blue 255 % / White 255 %, if channel 6 = 1 ... 16' },
          { 'value': 0, 'label': 'Microphone sensitivity, if channel 6 = 238 ... 255' },
        ],
      },
      'strobe': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 1, 'label': 'Stroboscope effect (0 % to 100 %)' },
        ],
      },
    },
  },
  'eurolite-led-bar-[6,12]-qcl-rgba-2ch': {
    channels: ['ctrl', 'DMX-Auto-program-speed,-increasing'],
    ranges: {
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 10, 'label': 'Auto mode via DMX' },
          { 'value': 120, 'label': 'Sound mode via DMX' },
        ],
      },
    },
  },
  'eurolite-led-bar-[6,12]-qcl-rgba-4ch': {
    channels: ['red', 'green', 'blue', 'amber'],
  },
  'eurolite-led-bar-[6,12]-qcl-rgba-5ch': {
    channels: ['dimmer', 'color-presets', 'strobe', 'ctrl', 'DMX-Auto-program-speed,-increasing'],
    ranges: {
      'color-pretsets': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 10, 'label': 'Red' },
          { 'value': 20, 'label': 'Green' },
          { 'value': 30, 'label': 'Blue' },
          { 'value': 40, 'label': 'Amber' },
          { 'value': 50, 'label': 'Green Yellow' },
          { 'value': 60, 'label': 'Cyan' },
          { 'value': 70, 'label': 'Magenta' },
          { 'value': 80, 'label': 'Yellow' },
          { 'value': 90, 'label': 'Turquoise' },
          { 'value': 100, 'label': 'Magenta' },
          { 'value': 110, 'label': 'Orange' },
          { 'value': 120, 'label': 'Light Green' },
          { 'value': 130, 'label': 'Magenta' },
          { 'value': 140, 'label': 'Pink' },
          { 'value': 150, 'label': 'Light Green' },
          { 'value': 160, 'label': 'Light Blue' },
          { 'value': 170, 'label': 'Salmon' },
          { 'value': 180, 'label': 'Cold white' },
          { 'value': 190, 'label': 'Warm white' },
          { 'value': 200, 'label': 'Lavender' },
        ],
      },
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 10, 'label': 'Auto mode via DMX' },
          { 'value': 120, 'label': 'Sound mode via DMX' },
        ],
      },
    },
  },
  'eurolite-led-bar-[6,12]-qcl-rgba-6ch': {
    channels: ['red', 'green', 'blue', 'amber', 'dimmer', 'ctrl'],
    ranges: {
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 1, 'label': 'Sound control' },
          { 'value': 6, 'label': 'No function' },
          { 'value': 11, 'label': 'Sound mode via DMX' },
        ],
      },
    },
  },
  'eurolite-led-bar-[6,12]-qcl-rgba-9ch': {
    channels: ['red', 'green', 'blue', 'amber', 'temperature', 'dimmer', 'strobe', 'ctrl', 'DMX-Auto-program-speed,-increasing'],
    ranges: {
      'temperature': {
        'type': 'option',
        'options:': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 10, 'label': '2700K' },
          { 'value': 30, 'label': '3200K' },
          { 'value': 50, 'label': '3400K' },
          { 'value': 70, 'label': '4200K' },
          { 'value': 90, 'label': '4900K' },
          { 'value': 110, 'label': '5600K' },
          { 'value': 130, 'label': '6000K' },
          { 'value': 150, 'label': '6500K' },
          { 'value': 170, 'label': '7500K' },
          { 'value': 190, 'label': '8000K' },
        ],
      },
      'strobe': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 10, 'label': 'strobe with increasing speed' },
        ],
      },
      'ctrl': {
        'type': 'option',
        'options': [
          { 'value': 0, 'label': 'No function' },
          { 'value': 10, 'label': 'Auto mode via DMX' },
          { 'value': 120, 'label': 'Sound mode via DMX' },
        ],
      },
    },
  },
};
