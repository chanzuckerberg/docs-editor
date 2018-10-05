'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var babelPluginFlowReactPropTypes_proptype_RenderCommentCall = require('./Types').babelPluginFlowReactPropTypes_proptype_RenderCommentCall || require('prop-types').any;

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
    }, _this._id = (0, _uniqueID2.default)(), _this._style = null, _this._requestCommentThreadReflow = function () {
      _this.props.onRequestCommentThreadReflow(_this.props.commentThreadId);
    }, _this._requestCommentThreadDeletion = function () {
      var el = document.getElementById(_this._id);
      if (el) {
        // TODO: This seems hacky.
        // A workaround to clear selection from editor.
        el.setAttribute('tabindex', '0');
        el.focus();
        _commentsManager2.default.requestCommentThreadDeletion(_this.props.commentThreadId);
      }
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
      _this._requestCommentThreadReflow();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsCommentSideItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _commentsManager2.default.observe(this._onObserve);
      this._requestCommentThreadReflow();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _commentsManager2.default.unobserve(this._onObserve);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          commentThreadId = _props.commentThreadId,
          renderComment = _props.renderComment;

      var isActive = this.state.active;
      var attrs = (0, _defineProperty3.default)({}, _commentsManager.ATTRIBUTE_COMMENT_THREAD_ID, commentThreadId);
      var childProps = {
        commentThreadId: commentThreadId,
        isActive: isActive,
        requestCommentThreadDeletion: this._requestCommentThreadDeletion,
        requestCommentThreadReflow: this._requestCommentThreadReflow
      };
      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({}, attrs, {
          id: this._id,
          className: 'docs-comment-side-item',
          style: this._style }),
        renderComment(childProps)
      );
    }
  }]);
  return DocsCommentSideItem;
}(_react2.default.PureComponent);

exports.default = DocsCommentSideItem;