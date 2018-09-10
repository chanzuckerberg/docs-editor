'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// https://stackoverflow.com/questions/19782975/convert-rgb-color-to-the-nearest-color-in-palette-web-safe-color
// TODO: Use binary search when palleteColors is sorted.

var COLOR_BUFFER = 20;

function getNearestColor(color, palleteColors) {
  var hue = color.hue();
  var lightness = color.lightness();
  var saturationv = color.saturationv();

  var colorStr = color.string();
  var hueDelta = 1000;
  var lightnessDelta = 1000;
  var saturationvDelta = 1000;
  var result = null;
  for (var ii = 0, jj = palleteColors.length; ii < jj; ii++) {
    var curr = palleteColors[ii];
    var hd = Math.abs(curr.hue() - hue);
    var ld = Math.abs(curr.lightness() - lightness);
    var sd = Math.abs(curr.saturationv() - saturationv);
    if (hd <= COLOR_BUFFER && ld <= COLOR_BUFFER && sd <= COLOR_BUFFER && hd <= hueDelta && ld <= lightnessDelta && sd <= saturationvDelta) {
      hueDelta = hd;
      lightnessDelta = ld;
      saturationvDelta = sd;
      result = curr;
    }

    if (hd === 0 && ld === 0 && sd === 0) {
      // Match exactly
      return curr;
    }
  }
  return result;
}

var resultCache = new _map2.default();

function getNearestColorFromCache(color, palleteColors) {
  var cacheForPalleteColors = resultCache.get(palleteColors) || new _map2.default();
  var cacheKey = color.hex();
  var result = cacheForPalleteColors.has(cacheKey) ? cacheForPalleteColors.get(cacheKey) : getNearestColor(color, palleteColors);

  cacheForPalleteColors.set(cacheKey, result);
  resultCache.set(palleteColors, cacheForPalleteColors);
  return result;
}

exports.default = getNearestColorFromCache;