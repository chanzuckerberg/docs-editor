"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function restoreDOMSelectionRange(range) {
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

exports.default = restoreDOMSelectionRange;