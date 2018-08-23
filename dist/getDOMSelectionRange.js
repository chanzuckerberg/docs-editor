"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// TODO: Type Range properly.

function getDOMSelectionRange() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  return selection.getRangeAt(0);
}

exports.default = getDOMSelectionRange;