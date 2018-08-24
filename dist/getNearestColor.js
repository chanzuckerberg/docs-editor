'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// https://stackoverflow.com/questions/19782975/convert-rgb-color-to-the-nearest-color-in-palette-web-safe-color
// TODO: Use binary search when palleteColors is sorted.

function getNearestColorByHue(color, palleteColors) {
  var hue = color.hue();
  var delta = 1000;
  var result = null;
  for (var ii = 0, jj = palleteColors.length; ii < jj; ii++) {
    var curr = palleteColors[ii];
    var currDelta = Math.abs(curr.hue() - hue);
    if (currDelta < delta) {
      delta = currDelta;
      result = curr;
    }
    if (delta === 0) {
      break;
    }
  }
  return result;
}

function getNearestColorByLightness(color, palleteColors) {
  var lightness = color.lightness();
  var delta = 1000;
  var result = null;
  for (var ii = 0, jj = palleteColors.length; ii < jj; ii++) {
    var curr = palleteColors[ii];
    var currDelta = Math.abs(curr.lightness() - lightness);
    if (currDelta < delta) {
      delta = currDelta;
      result = curr;
    }
    if (delta === 0) {
      break;
    }
  }
  return result;
}

function isColorGrey(color) {
  var rr = color.red();
  var gg = color.green();
  var bb = color.blue();
  return rr == gg && gg == bb;
}

function getNearestColor(color, palleteColors) {
  if (isColorGrey(color)) {
    return getNearestColorByLightness(color, palleteColors);
  } else {
    return getNearestColorByHue(color, palleteColors);
  }
}

exports.default = getNearestColor;