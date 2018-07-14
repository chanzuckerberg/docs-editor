'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _DocsDecorator = require('./DocsDecorator');

var _DocsDecorator2 = _interopRequireDefault(_DocsDecorator);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromRawWithDocsDecorator(rawContentState) {
  var decorator = _DocsDecorator2.default.get();
  if (rawContentState !== null && (typeof rawContentState === 'undefined' ? 'undefined' : (0, _typeof3.default)(rawContentState)) === 'object') {
    try {
      var contentState = (0, _draftJs.convertFromRaw)(rawContentState);
      return _draftJs.EditorState.createWithContent(contentState, decorator);
    } catch (ex) {
      // pass
    }
  }
  return _draftJs.EditorState.createEmpty(decorator);
}

module.exports = convertFromRawWithDocsDecorator;