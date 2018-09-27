'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLASS_NAME = exports.ATTRIBUTE_COMMENT_ID = exports.ATTRIBUTE_COMMENT_ACTIVE = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsDecoratorTypes = require('./DocsDecoratorTypes');

var _DocsDecoratorTypes2 = _interopRequireDefault(_DocsDecoratorTypes);

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _createDOMCustomEvent = require('./createDOMCustomEvent');

var _createDOMCustomEvent2 = _interopRequireDefault(_createDOMCustomEvent);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _getCurrentSelectionEntity = require('./getCurrentSelectionEntity');

var _getCurrentSelectionEntity2 = _interopRequireDefault(_getCurrentSelectionEntity);

var _getDOMSelectionNode = require('./getDOMSelectionNode');

var _getDOMSelectionNode2 = _interopRequireDefault(_getDOMSelectionNode);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

require('./DocsComment.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsCommentEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsCommentEntityData || require('prop-types').any;

var ATTRIBUTE_COMMENT_ACTIVE = exports.ATTRIBUTE_COMMENT_ACTIVE = 'data-docs-comment-active';
var ATTRIBUTE_COMMENT_ID = exports.ATTRIBUTE_COMMENT_ID = 'data-docs-comment-id';
var CLASS_NAME = exports.CLASS_NAME = 'docs-comment';

// This component for commented text.

var DocsComment = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsComment, _React$PureComponent);

  function DocsComment() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsComment);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsComment.__proto__ || (0, _getPrototypeOf2.default)(DocsComment)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _uniqueID2.default)(), _this._active = false, _this._eventsCapture = null, _this._unmounted = false, _this._timer = new _Timer2.default(), _this._checkActiveState = function (e) {
      _this._timer.clear();
      _this._timer.set(_this._syncActiveState);
    }, _this._syncActiveState = function () {
      var el = document.getElementById(_this._id);
      if (!el) {
        return;
      }
      var selectionNode = (0, _getDOMSelectionNode2.default)();
      var active = selectionNode === el || el.contains(selectionNode);
      _this._setActive(active);
    }, _this._onRequestFocus = function (e) {
      if (e.detail && e.detail.commentId === _this.props.entityData.commentId) {
        _this._setActive(true);
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsComment, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._listen();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      this._timer.clear();
      this._unlisten();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          entityData = _props.entityData;
      var commentId = entityData.commentId;

      var attrs = (0, _defineProperty3.default)({}, ATTRIBUTE_COMMENT_ID, commentId);
      return _react2.default.createElement(
        'span',
        (0, _extends3.default)({}, attrs, {
          name: commentId,
          className: CLASS_NAME,
          id: this._id }),
        children
      );
    }
  }, {
    key: '_listen',
    value: function _listen() {
      if (this._eventsCapture || this._unmounted) {
        return;
      }
      this._eventsCapture = (0, _captureDocumentEvents2.default)((0, _defineProperty3.default)({
        'keyup': this._checkActiveState,
        'click': this._checkActiveState
      }, _DocsEventTypes2.default.COMMENT_REQUEST_FOCUS, this._onRequestFocus));
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
    key: '_setActive',
    value: function _setActive(active) {
      if (active === this._active) {
        return;
      }

      var el = document.getElementById(this._id);
      if (!el) {
        return;
      }

      this._active = active;
      if (active) {
        el.setAttribute(ATTRIBUTE_COMMENT_ACTIVE, "true");
      } else {
        el.removeAttribute(ATTRIBUTE_COMMENT_ACTIVE);
      }

      // Notify the document that the comment is focused, so that we could
      // update the related comment panels.
      var commentId = this.props.entityData.commentId;


      var detail = {
        target: el,
        commentId: commentId
      };

      var event = (0, _createDOMCustomEvent2.default)(active ? _DocsEventTypes2.default.COMMENT_FOCUS_IN : _DocsEventTypes2.default.COMMENT_FOCUS_OUT, true, true, detail);

      el.dispatchEvent(event);
    }
  }]);
  return DocsComment;
}(_react2.default.PureComponent);

exports.default = (0, _withDocsContext2.default)(DocsComment);