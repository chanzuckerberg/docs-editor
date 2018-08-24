'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createWebSafeColors() {
  var result = [];
  for (var r = 0; r < 16; r += 3) {
    var rh = r.toString(16);
    for (var g = 0; g < 16; g += 3) {
      var gh = g.toString(16);
      for (var b = 0; b < 16; b += 3) {
        var bh = g.toString(16);
        var hex = '#' + rh + gh + bh;
        result.push((0, _color2.default)(hex));
      }
    }
  }
  return result;
}

exports.default = createWebSafeColors;