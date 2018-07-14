'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _DataTransfer = require('fbjs/lib/DataTransfer');

var _DataTransfer2 = _interopRequireDefault(_DataTransfer);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsClipboardManager = function () {
  function DocsClipboardManager() {
    var _this = this;

    (0, _classCallCheck3.default)(this, DocsClipboardManager);
    this._pasteData = null;
    this._timer = new _Timer2.default();

    this._onPaste = function (e) {
      _this._timer.clear();
      _this._pasteData = new _DataTransfer2.default((0, _nullthrows2.default)(e.clipboardData));
      // Only keep the paste data for 150ms.
      _this._timer.set(_this._clearPasteData, 150);
    };

    this._clearPasteData = function () {
      _this._pasteData = null;
    };

    // TODO: Dispose the events capture.
    (0, _captureDocumentEvents2.default)({
      copy: this._clearPasteData,
      paste: this._onPaste
    });
  }

  (0, _createClass3.default)(DocsClipboardManager, [{
    key: 'getClipboardData',
    value: function getClipboardData() {
      return this._pasteData;
    }
  }]);
  return DocsClipboardManager;
}();

module.exports = DocsClipboardManager;