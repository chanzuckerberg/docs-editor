'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://krazydad.com/tutorials/makecolors.php
// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// http://www.mattlag.com/colorchart/article.html
// https://www.w3schools.com/colors/colors_hsl.asp


function createPaletteColors(saturation, /* 0 ~ 100 */
lightness) {
  var result = [];
  var ss = Math.min(100, Math.max(Math.round(saturation), 0));
  var ll = Math.min(100, Math.max(Math.round(lightness), 0));
  var hue = 0;
  while (hue <= 360) {
    var hsl = 'hsl(' + hue + ',' + ss + '%,' + ll + '%)';
    result.push((0, _color2.default)(hsl));
    hue += 20;
  }
  return result;
}

exports.default = createPaletteColors;