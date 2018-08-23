'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

function isEditorStateEmpty(editorState) {
  return !editorState.getCurrentContent().hasText();
}

exports.default = isEditorStateEmpty;