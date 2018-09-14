'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

function isEditorStateEmpty(editorState) {
  var contentState = editorState.getCurrentContent();
  var hasText = contentState.hasText();
  if (hasText) {
    return false;
  }
  var blockMap = contentState.getBlockMap();
  if (blockMap.size > 1) {
    return false;
  }
  if (blockMap.size === 1) {
    return blockMap.first().getType() === 'unstyled';
  }
  return true;
}

exports.default = isEditorStateEmpty;