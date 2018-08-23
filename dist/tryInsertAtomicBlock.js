'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Core helper function.
// Do not require any Component or Modifier in this file to avoid circular
// dependiencies.

function tryInsertAtomicBlock(editorState, entityKey, text) {
  try {
    return _draftJs.AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, text);
  } catch (ex) {
    (0, _warn2.default)(ex);
    return null;
  }
}

exports.default = tryInsertAtomicBlock;