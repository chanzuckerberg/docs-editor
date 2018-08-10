'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ClientRectLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ClientRectLike || require('prop-types').any;

function getDOMSelectionRect() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  var range = selection.getRangeAt(0);
  var rect = range ? range.getBoundingClientRect() : null;
  if (rect && rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0 && range && range.commonAncestorContainer) {
    // If the selection is collapsed, the rect will be empty.
    // use the element's rect where the cursor is at instead.
    rect = range.commonAncestorContainer.getBoundingClientRect();
  }
  return rect;
}

exports.default = getDOMSelectionRect;