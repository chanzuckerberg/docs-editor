'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLASS_NAME = undefined;

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

var _commentsManager = require('./commentsManager');

var _commentsManager2 = _interopRequireDefault(_commentsManager);

var _createDOMCustomEvent = require('./createDOMCustomEvent');

var _createDOMCustomEvent2 = _interopRequireDefault(_createDOMCustomEvent);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _getCurrentSelectionEntity = require('./getCurrentSelectionEntity');

var _getCurrentSelectionEntity2 = _interopRequireDefault(_getCurrentSelectionEntity);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

require('./DocsComment.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsCommentEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsCommentEntityData || require('prop-types').any;

var CLASS_NAME = exports.CLASS_NAME = 'docs-comment';

function getCommentThreadId(props) {
  var commentThreadId = props.entityData.commentThreadId;

  return commentThreadId;
}

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

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsComment.__proto__ || (0, _getPrototypeOf2.default)(DocsComment)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _uniqueID2.default)(), _this.state = {
      active: false,
      commentThreadId: getCommentThreadId(_this.props)
    }, _this._onObserve = function (info) {
      var type = info.type,
          commentThreadId = info.commentThreadId;

      if (type === _DocsEventTypes2.default.COMMENT_CHANGE) {
        var active = _this.state.active;

        var val = _this.state.commentThreadId === commentThreadId;
        if (val !== active) {
          _this.setState({ active: val });
        }
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsComment, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      _commentsManager2.default.registerCommentElement(this.state.commentThreadId, this);
      _commentsManager2.default.observe(this._onObserve);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _commentsManager2.default.unregisterCommentElement(this.state.commentThreadId, this);
      _commentsManager2.default.unobserve(this._onObserve);
    }
  }, {
    key: 'render',
    value: function render() {
      var _ref2;

      var children = this.props.children;
      var _state = this.state,
          active = _state.active,
          commentThreadId = _state.commentThreadId;

      if (!commentThreadId) {
        return _react2.default.createElement(
          'span',
          null,
          children
        );
      }
      var attrs = active ? (_ref2 = {}, (0, _defineProperty3.default)(_ref2, _commentsManager.ATTRIBUTE_COMMENT_ACTIVE, 'true'), (0, _defineProperty3.default)(_ref2, _commentsManager.ATTRIBUTE_COMMENT_THREAD_ID, commentThreadId), _ref2) : (0, _defineProperty3.default)({}, _commentsManager.ATTRIBUTE_COMMENT_THREAD_ID, commentThreadId);
      return _react2.default.createElement(
        'span',
        (0, _extends3.default)({}, attrs, {
          name: commentThreadId,
          className: CLASS_NAME,
          id: this._id }),
        children
      );
    }
  }]);
  return DocsComment;
}(_react2.default.PureComponent);

exports.default = (0, _withDocsContext2.default)(DocsComment);