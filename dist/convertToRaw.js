'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertToRaw(editorState) {
  var state = editorState;
  var contentState = void 0;
  if (state instanceof _draftJs.ContentState) {
    // TODO: Fix all teh warnings.
    (0, _warn2.default)('convertToRaw should only accept EditorState, not ContentState');
    contentState = state;
  } else {
    contentState = editorState.getCurrentContent();
  }
  return (0, _draftJs.convertToRaw)(contentState);
}

exports.default = convertToRaw;