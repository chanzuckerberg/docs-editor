'use strict';

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

var _DocsCommentSideItem = require('./DocsCommentSideItem');

var _DocsCommentSideItem2 = _interopRequireDefault(_DocsCommentSideItem);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _commentsManager = require('./commentsManager');

var _commentsManager2 = _interopRequireDefault(_commentsManager);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _DocsComment = require('./DocsComment');

var _draftJs = require('draft-js');

require('./DocsCommentsSidePanel.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsCommentEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsCommentEntityData || require('prop-types').any;

var UPDATE_DELAY = 500;

var DocsCommentsSidePanelTemplate = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsCommentsSidePanelTemplate, _React$PureComponent);

  function DocsCommentsSidePanelTemplate() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsCommentsSidePanelTemplate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsCommentsSidePanelTemplate.__proto__ || (0, _getPrototypeOf2.default)(DocsCommentsSidePanelTemplate)).call.apply(_ref, [this].concat(args))), _this), _this._renderItem = function (commentThreadId) {
      var _this$props = _this.props,
          activeCommentThreadId = _this$props.activeCommentThreadId,
          renderComment = _this$props.renderComment;

      return _react2.default.createElement(_DocsCommentSideItem2.default, {
        commentThreadId: commentThreadId,
        key: commentThreadId,
        renderComment: renderComment
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsCommentsSidePanelTemplate, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          commentThreadIds = _props.commentThreadIds,
          renderComment = _props.renderComment;

      return _react2.default.createElement(
        'div',
        { className: 'docs-comments-side-panel' },
        commentThreadIds.map(this._renderItem)
      );
    }
  }]);
  return DocsCommentsSidePanelTemplate;
}(_react2.default.PureComponent);

var DocsCommentsSidePanel = function (_React$PureComponent2) {
  (0, _inherits3.default)(DocsCommentsSidePanel, _React$PureComponent2);

  function DocsCommentsSidePanel() {
    var _ref2;

    var _temp2, _this2, _ret2;

    (0, _classCallCheck3.default)(this, DocsCommentsSidePanel);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref2 = DocsCommentsSidePanel.__proto__ || (0, _getPrototypeOf2.default)(DocsCommentsSidePanel)).call.apply(_ref2, [this].concat(args))), _this2), _this2.state = {
      activeCommentThreadId: _commentsManager2.default.getActiveCommentThreadId(),
      commentThreadIds: _commentsManager2.default.getCommentThreadIds()
    }, _temp2), (0, _possibleConstructorReturn3.default)(_this2, _ret2);
  }

  (0, _createClass3.default)(DocsCommentsSidePanel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currContent = this.props.editorState.getCurrentContent();
      var nextContent = nextProps.editorState.getCurrentContent();
      if (currContent !== nextContent) {
        var _commentThreadIds = _commentsManager2.default.getCommentThreadIds();
        var _activeCommentThreadId = _commentsManager2.default.getActiveCommentThreadId();
        this.setState({
          activeCommentThreadId: _commentsManager2.default.getActiveCommentThreadId(),
          commentThreadIds: _commentsManager2.default.getCommentThreadIds()
        });
      }
      _commentsManager2.default.setEditorState(nextProps.editorState);
    }
  }, {
    key: 'render',
    value: function render() {
      var docsContext = this.context && this.context.docsContext;
      var runtime = docsContext && docsContext.runtime;
      var renderComment = runtime && runtime.renderComment;
      if (!renderComment) {
        return null;
      }

      var _state = this.state,
          activeCommentThreadId = _state.activeCommentThreadId,
          commentThreadIds = _state.commentThreadIds;

      if (!commentThreadIds.length) {
        return null;
      }
      var editorState = this.props.editorState;

      return _react2.default.createElement(DocsCommentsSidePanelTemplate, {
        activeCommentThreadId: activeCommentThreadId,
        commentThreadIds: commentThreadIds,
        renderComment: renderComment
      });
    }
  }]);
  return DocsCommentsSidePanel;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsCommentsSidePanel);