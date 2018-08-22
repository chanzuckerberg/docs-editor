'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DocsDecorator = require('./DocsDecorator');

var _DocsDecorator2 = _interopRequireDefault(_DocsDecorator);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyEditorState = null;

function createEmptyEditorState() {
  if (!emptyEditorState) {
    var decorator = _DocsDecorator2.default.get();
    emptyEditorState = _draftJs.EditorState.createEmpty(decorator);
  }
  return emptyEditorState;
}

exports.default = createEmptyEditorState;