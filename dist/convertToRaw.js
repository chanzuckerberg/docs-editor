'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

function convertToRaw(content) {
  return (0, _draftJs.convertToRaw)(content);
}

exports.default = convertToRaw;