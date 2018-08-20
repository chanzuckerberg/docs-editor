'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _DocsDecorator = require('./DocsDecorator');

var _DocsDecorator2 = _interopRequireDefault(_DocsDecorator);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromRaw(rawContentState, editorState) {
  var decorator = _DocsDecorator2.default.get();
  if (rawContentState !== null && (typeof rawContentState === 'undefined' ? 'undefined' : (0, _typeof3.default)(rawContentState)) === 'object') {
    var contentState = void 0;
    try {
      contentState = (0, _draftJs.convertFromRaw)(rawContentState);
    } catch (ex) {
      // pass
    }

    if (contentState) {
      return editorState ? _draftJs.EditorState.push(editorState, contentState) : _draftJs.EditorState.createWithContent(contentState, decorator);
    }
  }
  return _draftJs.EditorState.createEmpty(decorator);
}

module.exports = convertFromRaw;