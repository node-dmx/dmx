const convert = require('color-convert');

module.exports = class plibAnim {
  static convertToDMX(body) {
    // {"0": 255, "1": 0, "2": 244, "3": 255}
    // Channel 4c-1
    let convertedOpacity, convertedColor;

    if (body.opacity === 0) {
      convertedOpacity = 0;
      convertedColor = [0, 0, 0];
    } else {
      convertedColor = this._convertHexToRgb(body.color);
      convertedOpacity = this._convertOpacity(body.opacity);
    }

    console.log('convertedOpacity', convertedOpacity);
    console.log('convertedColor', convertedColor);

    return {
      "0": convertedOpacity,
      "1": convertedColor[0],
      "2": convertedColor[1],
      "3": convertedColor[2],
    }
  }

  static _convertOpacity(opacity) {
    return (opacity * 100) * 255 / 100;
  }

  static _convertHexToRgb(c) {
    if (this._validHex(c)) {
      return convert.hex.rgb(c);
    }
    return convert.keyword.rgb(c) || `Color "${c}" is invalid.`;
  }
  
  static _validHex(c) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c);
  }
}
