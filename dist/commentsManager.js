'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATTRIBUTE_COMMENT_USE_TRANSITION = exports.ATTRIBUTE_COMMENT_THREAD_ID = exports.ATTRIBUTE_COMMENT_ACTIVE = undefined;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _convertFromRaw = require('./convertFromRaw');

var _convertFromRaw2 = _interopRequireDefault(_convertFromRaw);

var _getDOMSelectionNode = require('./getDOMSelectionNode');

var _getDOMSelectionNode2 = _interopRequireDefault(_getDOMSelectionNode);

var _lookupElementByAttribute = require('./lookupElementByAttribute');

var _lookupElementByAttribute2 = _interopRequireDefault(_lookupElementByAttribute);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsCommentElement = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsCommentElement || require('prop-types').any;

var ATTRIBUTE_COMMENT_ACTIVE = exports.ATTRIBUTE_COMMENT_ACTIVE = 'data-docs-comment-active';
var ATTRIBUTE_COMMENT_THREAD_ID = exports.ATTRIBUTE_COMMENT_THREAD_ID = 'data-docs-comment-thread-id';
var ATTRIBUTE_COMMENT_USE_TRANSITION = exports.ATTRIBUTE_COMMENT_USE_TRANSITION = 'data-docs-comment-use-transition';

var DocsCommentsManager = function () {
  function DocsCommentsManager() {
    var _this = this;

    (0, _classCallCheck3.default)(this, DocsCommentsManager);

    this._onKeyDown = function (e) {
      var selectionNode = (0, _getDOMSelectionNode2.default)();
      if (selectionNode && selectionNode.nodeType === 1) {
        _this._onAccessElement((0, _asElement2.default)(selectionNode));
      } else {
        var activeCommentThreadId = _this._activeCommentThreadId;
        _this._activeCommentThreadId = null;
        activeCommentThreadId && _this._onChange();
      }
    };

    this._onMouseDown = function (e) {
      if (!e.defaultPrevented) {
        _this._onAccessElement((0, _asElement2.default)(e.target));
      }
    };

    this._activeCommentThreadId = null;
    this._eventsCapture = null;
    this._entries = new _map2.default();
    this._observeCallbacks = new _set2.default();
    this._editorState = (0, _convertFromRaw2.default)({});
  }

  (0, _createClass3.default)(DocsCommentsManager, [{
    key: 'registerCommentElement',
    value: function registerCommentElement(commentThreadId, component) {
      var components = this._entries.get(commentThreadId) || new _set2.default();
      if (components.has(component)) {
        return;
      }
      components.add(component);
      this._entries.set(commentThreadId, components);
      if (this._entries.size === 1) {
        this._listen();
      }
    }
  }, {
    key: 'unregisterCommentElement',
    value: function unregisterCommentElement(commentThreadId, component) {
      var components = this._entries.get(commentThreadId);
      if (!components || !components.has(component)) {
        return;
      }
      components.delete(component);
      if (components.size) {
        this._entries.set(commentThreadId, components);
      } else {
        this._entries.delete(commentThreadId);
      }
      if (this._entries.size === 0) {
        this._unlisten();
      }
    }
  }, {
    key: 'requestCommentThreadDeletion',
    value: function requestCommentThreadDeletion(commentThreadId) {
      (0, _from2.default)(this._observeCallbacks).forEach(function (fn) {
        return fn({
          type: _DocsEventTypes2.default.COMMENT_REQUEST_DELETE,
          commentThreadId: commentThreadId
        });
      });
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this._observeCallbacks.add(callback);
    }
  }, {
    key: 'unobserve',
    value: function unobserve(callback) {
      this._observeCallbacks.delete(callback);
    }
  }, {
    key: 'setEditorState',
    value: function setEditorState(editorState) {
      if (editorState !== this._editorState) {
        var changed = this._editorState.getCurrentContent() !== editorState.getCurrentContent();

        this._editorState = editorState;
        changed && this._onChange();
      }
    }
  }, {
    key: 'getActiveCommentThreadId',
    value: function getActiveCommentThreadId() {
      return this._activeCommentThreadId;
    }
  }, {
    key: 'getCommentThreadIds',
    value: function getCommentThreadIds() {
      var ids = [];
      this._entries.forEach(function (components, commentThreadId) {
        if (commentThreadId && commentThreadId !== '*') {
          components.size && ids.push(commentThreadId);
        }
      });
      return ids;
    }
  }, {
    key: '_listen',
    value: function _listen() {
      if (this._eventsCapture) {
        return;
      }
      this._eventsCapture = (0, _captureDocumentEvents2.default)({
        'keyup': this._onKeyDown,
        'mousedown': this._onMouseDown
      }, true);
    }
  }, {
    key: '_unlisten',
    value: function _unlisten() {
      if (!this._eventsCapture) {
        return;
      }
      this._eventsCapture && this._eventsCapture.dispose();
      this._eventsCapture = null;
    }
  }, {
    key: '_onAccessElement',
    value: function _onAccessElement(el) {
      var target = (0, _lookupElementByAttribute2.default)(el, ATTRIBUTE_COMMENT_THREAD_ID);
      var activeCommentThreadId = this._activeCommentThreadId;
      if (target) {
        var _commentThreadId = target.getAttribute(ATTRIBUTE_COMMENT_THREAD_ID);
        if (activeCommentThreadId && activeCommentThreadId === _commentThreadId) {
          return;
        }
        this._activeCommentThreadId = _commentThreadId;
        this._onChange();
      } else {
        if (activeCommentThreadId) {
          this._activeCommentThreadId = null;
          this._onChange();
        }
      }
    }
  }, {
    key: '_onChange',
    value: function _onChange() {
      var _this2 = this;

      (0, _from2.default)(this._observeCallbacks).forEach(function (fn) {
        return fn({
          type: _DocsEventTypes2.default.COMMENT_CHANGE,
          commentThreadId: _this2._activeCommentThreadId
        });
      });
    }
  }]);
  return DocsCommentsManager;
}();

var commentsManager = new DocsCommentsManager();

exports.default = commentsManager;