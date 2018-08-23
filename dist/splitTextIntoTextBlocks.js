"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// This is copied from
// draft-js/src/component/utils/splitTextIntoTextBlocks.js
var NEWLINE_REGEX = /\r\n?|\n/g;

function splitTextIntoTextBlocks(text) {
  return text.split(NEWLINE_REGEX);
}

exports.default = splitTextIntoTextBlocks;