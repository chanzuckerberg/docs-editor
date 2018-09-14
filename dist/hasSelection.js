'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasSelection;

var _draftJs = require('draft-js');

function hasSelection(editorState) {
  var selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
}