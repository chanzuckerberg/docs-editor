'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _createPaletteColors = require('./createPaletteColors');

var _createPaletteColors2 = _interopRequireDefault(_createPaletteColors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Color = _color2.default;
// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// https://stackoverflow.com/questions/19782975/convert-rgb-color-to-the-nearest-color-in-palette-web-safe-color

function getNearestColor(color, sortedColors, debug) {
  var head = sortedColors[0];
  var tail = sortedColors[sortedColors.length - 1];
  if (!head || !tail) {
    return null;
  }
  var hue = color.hue();
  // TODO: Use binary search.
  var delta = 1000;
  var result = null;
  for (var ii = 0, jj = sortedColors.length; ii < jj; ii++) {
    var curr = sortedColors[ii];
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

exports.default = getNearestColor;