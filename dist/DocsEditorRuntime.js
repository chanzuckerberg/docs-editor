'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This defines abstract class with the APIs that depend on the specific app
// that the editor is running within. This serves as a bridge to enable editor
// communicate with the app server to do tasks such as uploading images,
// load comments, ...etc.

var babelPluginFlowReactPropTypes_proptype_RenderCommentProps = require('./Types').babelPluginFlowReactPropTypes_proptype_RenderCommentProps || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ImageLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ImageLike || require('prop-types').any;

var DocsEditorRuntime = function () {
  function DocsEditorRuntime() {
    (0, _classCallCheck3.default)(this, DocsEditorRuntime);
  }

  (0, _createClass3.default)(DocsEditorRuntime, [{
    key: 'canUploadImage',
    value: function canUploadImage() {
      return false;
    }
  }, {
    key: 'canLoadHTML',
    value: function canLoadHTML() {
      return false;
    }
  }, {
    key: 'canComment',
    value: function canComment() {
      return false;
    }
  }, {
    key: 'canProxyImageSrc',
    value: function canProxyImageSrc(src) {
      return false;
    }
  }, {
    key: 'createCommentThreadID',
    value: function createCommentThreadID() {
      return '';
    }
  }, {
    key: 'getProxyImageSrc',
    value: function getProxyImageSrc(src) {
      return src;
    }
  }, {
    key: 'uploadImage',
    value: function uploadImage(obj) {
      return _promise2.default.reject('Unsupported');
    }
  }, {
    key: 'loadHTML',
    value: function loadHTML() {
      return _promise2.default.reject('Unsupported');
    }
  }, {
    key: 'renderComment',
    value: function renderComment(props) {
      return null;
    }
  }]);
  return DocsEditorRuntime;
}();

;

exports.default = DocsEditorRuntime;