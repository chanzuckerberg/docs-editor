'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

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

var _commentsManager = require('./commentsManager');

var _commentsManager2 = _interopRequireDefault(_commentsManager);

var _createDOMCustomEvent = require('./createDOMCustomEvent');

var _createDOMCustomEvent2 = _interopRequireDefault(_createDOMCustomEvent);

var _lookupElementByAttribute = require('./lookupElementByAttribute');

var _lookupElementByAttribute2 = _interopRequireDefault(_lookupElementByAttribute);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _draftJs = require('draft-js');

require('./DocsCommentSideItem.css');

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

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsCommentSideItem.__proto__ || (0, _getPrototypeOf2.default)(DocsCommentSideItem)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      active: _this.props.commentThreadId === _commentsManager2.default.getActiveCommentThreadId()
    }, _this._id = (0, _uniqueID2.default)(), _this._rid = 0, _this._style = null, _this._onDismiss = function () {
      _commentsManager2.default.requestCommentThreadDeletion(_this.props.commentThreadId);
    }, _this._onObserve = function (info) {
      var type = info.type,
          commentThreadId = info.commentThreadId;

      if (type === _DocsEventTypes2.default.COMMENT_CHANGE) {
        var active = _this.state.active;

        var val = _this.props.commentThreadId === commentThreadId;
        if (val !== active) {
          _this.setState({ active: val });
        }
      }
      _this._syncPosition();
    }, _this._syncPositionImmediate = function () {
      var commentThreadId = _this.props.commentThreadId;

      var el = document.getElementById(_this._id);
      if (!el) {
        return;
      }
      var scrollEl = (0, _lookupElementByAttribute2.default)(el, 'className', 'docs-editor-frame-body-scroll');

      if (!scrollEl) {
        return;
      }

      var commentEls = (0, _from2.default)(document.getElementsByName(commentThreadId));
      var firstCommentEl = commentEls[0];
      if (!firstCommentEl) {
        return;
      }
      var scrollRect = scrollEl.getBoundingClientRect();
      var commentRect = firstCommentEl.getBoundingClientRect();
      var top = commentRect.top - scrollRect.top + scrollEl.scrollTop;
      var cssTransform = 'translate3d(0, ' + top + 'px, 0)';
      var nextStyle = (0, _extends3.default)({}, _this._style, {
        backfaceVisibility: 'hidden',
        transform: cssTransform,
        zIndex: _this.state.active ? 2 : 1
      });

      (0, _assign2.default)(el.style, nextStyle);

      // The second-time transtion will have animation.
      (0, _assign2.default)(nextStyle, {
        transitionProperty: 'trasnform',
        transitionDuration: '250ms',
        transitionTimingFunction: 'ease-in'
      });

      _this._style = nextStyle;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsCommentSideItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _commentsManager2.default.observe(this._onObserve);
      this._syncPosition();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _commentsManager2.default.unobserve(this._onObserve);
      this._rid && window.cancelAnimationFrame(this._rid);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          commentThreadId = _props.commentThreadId,
          renderComment = _props.renderComment;

      var isActive = this.state.active;
      var attrs = (0, _defineProperty3.default)({}, _commentsManager.ATTRIBUTE_COMMENT_THREAD_ID, commentThreadId);
      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({}, attrs, {
          id: this._id,
          className: 'docs-comment-side-item',
          style: this._style }),
        renderComment({ commentThreadId: commentThreadId, isActive: isActive, onDismiss: this._onDismiss })
      );
    }
  }, {
    key: '_syncPosition',
    value: function _syncPosition() {
      window.cancelAnimationFrame(this._rid);
      this._rid = window.requestAnimationFrame(this._syncPositionImmediate);
    }
  }]);
  return DocsCommentSideItem;
}(_react2.default.PureComponent);

exports.default = DocsCommentSideItem;