'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasNoSelection;

var _hasSelection = require('./hasSelection');

var _hasSelection2 = _interopRequireDefault(_hasSelection);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasNoSelection(editorState) {
  return !(0, _hasSelection2.default)(editorState);
}