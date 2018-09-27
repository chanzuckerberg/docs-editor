'use strict';

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

var _DocsCommentSideItem = require('./DocsCommentSideItem');

var _DocsCommentSideItem2 = _interopRequireDefault(_DocsCommentSideItem);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

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

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

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

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsCommentsSidePanelTemplate.__proto__ || (0, _getPrototypeOf2.default)(DocsCommentsSidePanelTemplate)).call.apply(_ref, [this].concat(args))), _this), _this._renderItem = function (commentId) {
      var renderComment = _this.props.renderComment;

      return _react2.default.createElement(_DocsCommentSideItem2.default, {
        commentId: commentId,
        key: commentId,
        renderComment: renderComment
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsCommentsSidePanelTemplate, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          commentIds = _props.commentIds,
          renderComment = _props.renderComment;

      return _react2.default.createElement(
        'div',
        { className: 'docs-comments-side-panel' },
        commentIds.map(this._renderItem)
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

    return _ret2 = (_temp2 = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref2 = DocsCommentsSidePanel.__proto__ || (0, _getPrototypeOf2.default)(DocsCommentsSidePanel)).call.apply(_ref2, [this].concat(args))), _this2), _this2._eventsCapture = null, _this2._unmounted = false, _this2._timer = new _Timer2.default(), _this2.state = {
      commentIds: []
    }, _this2._lookupCommentIDs = function () {
      var editorId = _this2.props.editorId;

      var editorEl = document.getElementById(editorId);
      if (!editorEl) {
        return;
      }
      var els = editorEl.querySelectorAll('.' + _DocsComment.CLASS_NAME);
      var commentIds = (0, _from2.default)(els).reduce(function (memo, el) {
        var commentId = el.getAttribute(_DocsComment.ATTRIBUTE_COMMENT_ID);
        if (commentId && memo.indexOf(commentId) === -1) {
          memo.push(commentId);
        }
        return memo;
      }, []);

      if (commentIds.length === _this2.state.commentIds.length && commentIds.join(',') === _this2.state.commentIds.join(',')) {
        return;
      }
      _this2.setState({ commentIds: commentIds });
    }, _temp2), (0, _possibleConstructorReturn3.default)(_this2, _ret2);
  }

  (0, _createClass3.default)(DocsCommentsSidePanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._timer.set(this._lookupCommentIDs, UPDATE_DELAY);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.editorState.getCurrentContent() === this.props.editorState.getCurrentContent()) {
        return;
      }
      this._timer.clear();
      this._timer.set(this._lookupCommentIDs, UPDATE_DELAY);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._timer.clear();
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
      var commentIds = this.state.commentIds;

      if (!commentIds.length) {
        return null;
      }
      return _react2.default.createElement(DocsCommentsSidePanelTemplate, {
        commentIds: commentIds,
        renderComment: renderComment
      });
    }
  }]);
  return DocsCommentsSidePanel;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsCommentsSidePanel);