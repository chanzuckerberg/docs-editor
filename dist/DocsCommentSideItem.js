'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsCommentSideItem = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsCommentSideItem, _React$PureComponent);

  function DocsCommentSideItem() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsCommentSideItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsCommentSideItem.__proto__ || (0, _getPrototypeOf2.default)(DocsCommentSideItem)).call.apply(_ref, [this].concat(args))), _this), _this._eventsCapture = null, _this.state = {
      isActive: false
    }, _this._onFocusIn = function (e) {
      if (e.detail && e.detail.commentId === _this.props.commentId) {
        _this.setState({ isActive: true });
      }
    }, _this._onFocusOut = function (e) {
      if (e.detail && e.detail.commentId === _this.props.commentId) {
        _this.setState({ isActive: false });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsCommentSideItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._listen();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unlisten();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          commentId = _props.commentId,
          renderComment = _props.renderComment;
      var isActive = this.state.isActive;

      return _react2.default.createElement(
        'div',
        { className: 'docs-comment-side-item' },
        renderComment({ commentId: commentId, isActive: isActive })
      );
    }
  }, {
    key: '_listen',
    value: function _listen() {
      var _captureDocumentEvent;

      if (this._eventsCapture) {
        return;
      }
      this._eventsCapture = (0, _captureDocumentEvents2.default)((_captureDocumentEvent = {}, (0, _defineProperty3.default)(_captureDocumentEvent, _DocsEventTypes2.default.COMMENT_FOCUS_IN, this._onFocusIn), (0, _defineProperty3.default)(_captureDocumentEvent, _DocsEventTypes2.default.COMMENT_FOCUS_OUT, this._onFocusOut), _captureDocumentEvent));
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
  }]);
  return DocsCommentSideItem;
}(_react2.default.PureComponent);

exports.default = DocsCommentSideItem;