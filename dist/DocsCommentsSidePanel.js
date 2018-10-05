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

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

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

var _lookupElementByAttribute = require('./lookupElementByAttribute');

var _lookupElementByAttribute2 = _interopRequireDefault(_lookupElementByAttribute);

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

function sortBoxes(one, two) {
  var t1 = one.top;
  var t2 = two.top;
  if (t1 > t2) {
    return 1;
  } else if (t2 > t1) {
    return -1;
  } else {
    return one.left >= two.left ? 1 : -1;
  }
}

function getSideItemElementBoxes(root) {
  return (0, _from2.default)(root.querySelectorAll('div[' + _commentsManager.ATTRIBUTE_COMMENT_THREAD_ID + ']')).map(function (view) {
    var commentThreadId = view.getAttribute(_commentsManager.ATTRIBUTE_COMMENT_THREAD_ID);
    if (!commentThreadId) {
      return null;
    }
    var commentEls = document.getElementsByName(String(commentThreadId));
    var target = commentEls[0];
    if (!target) {
      return null;
    }
    var targetRect = target.getBoundingClientRect();
    var viewRect = view.getBoundingClientRect();

    return {
      active: _commentsManager2.default.getActiveCommentThreadId() === commentThreadId,
      activeTop: 0,
      commentThreadId: commentThreadId,
      height: viewRect.height,
      left: targetRect.left,
      top: 0,
      rect: {
        top: 0,
        height: 0,
        left: 0
      },
      view: view,
      viewRect: {
        top: viewRect.top,
        height: viewRect.height,
        left: 0
      },
      target: target,
      targetRect: {
        height: targetRect.height,
        left: targetRect.left,
        top: targetRect.top
      }
    };
  }).filter(Boolean);
}

function updateSideItemElementPositions(root) {
  var scrollEl = (0, _lookupElementByAttribute2.default)(root, 'className', 'docs-editor-frame-body-scroll');

  if (!scrollEl) {
    return;
  }
  var scrollRect = scrollEl.getBoundingClientRect();
  var scrollTop = scrollEl.scrollTop - scrollRect.top;
  var boxes = getSideItemElementBoxes(root);
  var activeBox = null;

  // Sets initial value.
  boxes.forEach(function (box) {
    box.height = box.viewRect.height;
    box.left = box.targetRect.left;
    box.top = box.targetRect.top + scrollTop;
    activeBox = box.active && !activeBox ? box : activeBox;
  });

  boxes.sort(sortBoxes);

  // Ensure boxes don't overlap.
  boxes.forEach(function (box, ii) {
    var prevBox = boxes[ii - 1];
    if (!prevBox) {
      return;
    }
    var overflow = prevBox.top + prevBox.height - box.top;
    if (overflow > 0) {
      box.top += overflow;
    }
  });

  // Move the active box to visible location.
  boxes.some(function (box, ii) {
    if (!box.active) {
      return;
    }

    var newTop = box.targetRect.top + scrollTop;
    var delta = newTop - box.top;
    if (delta >= 0) {
      return true;
    }
    box.top = newTop;
    boxes.forEach(function (anotherBox, jj) {
      if (anotherBox !== box) {
        anotherBox.top += delta;
      }
    });
    return true;
  });

  boxes.forEach(function (box, ii) {
    var el = box.view;
    var top = box.top;
    var left = box.active ? -10 : 0;
    var style = el.style;
    if (!style) {
      return;
    }
    var nextStyle = {
      transform: 'translate3d(' + left + 'px, ' + Math.round(top) + 'px, 0)',
      zIndex: box.active ? 2 : 1
    };
    if (style.transform && !el.hasAttribute(_commentsManager.ATTRIBUTE_COMMENT_USE_TRANSITION)) {
      el.setAttribute(_commentsManager.ATTRIBUTE_COMMENT_USE_TRANSITION, 'y');
    }
    (0, _assign2.default)(style, nextStyle);
  });

  if (!activeBox) {
    return;
  }

  try {
    var _activeBox = activeBox,
        _target = _activeBox.target;

    if (_target.scrollIntoViewIfNeeded) {
      _target.scrollIntoViewIfNeeded(true);
    } else if (_target.scrollIntoView) {
      _target.scrollIntoView('smooth');
    }
  } catch (ex) {
    // skip
  }
}

var DocsCommentsSidePanelTemplate = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsCommentsSidePanelTemplate, _React$PureComponent);

  function DocsCommentsSidePanelTemplate() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsCommentsSidePanelTemplate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsCommentsSidePanelTemplate.__proto__ || (0, _getPrototypeOf2.default)(DocsCommentsSidePanelTemplate)).call.apply(_ref, [this].concat(args))), _this), _this._rid = 0, _this._id = (0, _uniqueID2.default)(), _this._renderItem = function (commentThreadId) {
      var _this$props = _this.props,
          activeCommentThreadId = _this$props.activeCommentThreadId,
          renderComment = _this$props.renderComment;

      return _react2.default.createElement(_DocsCommentSideItem2.default, {
        commentThreadId: commentThreadId,
        key: commentThreadId,
        onRequestCommentThreadReflow: _this._syncPosition,
        renderComment: renderComment
      });
    }, _this._syncPosition = function () {
      window.cancelAnimationFrame(_this._rid);
      _this._rid = window.requestAnimationFrame(_this._syncPositionImmediate);
    }, _this._syncPositionImmediate = function () {
      var el = document.getElementById(_this._id);
      if (el) {
        updateSideItemElementPositions(el);
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsCommentsSidePanelTemplate, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._rid && window.cancelAnimationFrame(this._rid);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          commentThreadIds = _props.commentThreadIds,
          renderComment = _props.renderComment;

      return _react2.default.createElement(
        'div',
        { className: 'docs-comments-side-panel', id: this._id },
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