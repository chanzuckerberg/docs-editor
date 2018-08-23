"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getDOMSelectionNode() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  var range = selection.getRangeAt(0);
  var node = range.commonAncestorContainer;
  if (node && node.nodeType === 3) {
    // TEXT_NODE
    node = node.parentElement;
  }
  return node || null;
}

exports.default = getDOMSelectionNode;