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

var _DocsEditorToolBarButton = require('./DocsEditorToolBarButton');

var _DocsEditorToolBarButton2 = _interopRequireDefault(_DocsEditorToolBarButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _reactBootstrap = require('react-bootstrap');

var _draftJs = require('draft-js');

var _DocsBehaviors = require('./DocsBehaviors');

require('./DocsEditorToolBar.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsBehavior = require('./DocsBehaviors').babelPluginFlowReactPropTypes_proptype_DocsBehavior || require('prop-types').any;

var DUMMY_EDITOR = {
  props: {}
};

var DocsEditorToolBar = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsEditorToolBar, _React$PureComponent);

  function DocsEditorToolBar() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsEditorToolBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsEditorToolBar.__proto__ || (0, _getPrototypeOf2.default)(DocsEditorToolBar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      focusedEditorState: null
    }, _this._eventsCapture = null, _this._timer = new _Timer2.default(), _this._modalHandle = null, _this._renderButton = function (feature) {
      if (!feature) {
        return null;
      }
      var allowedActions = _this.context.docsContext.allowedActions;

      if (!allowedActions.has(feature.action)) {
        return null;
      }

      var editor = _this.props.getEditor() || DUMMY_EDITOR;

      var _ref2 = feature === _DocsBehaviors.REDO || feature === _DocsBehaviors.UNDO ? _this.props : editor.props,
          editorState = _ref2.editorState;

      var disabled = editorState ? !feature.isEnabled(editorState) : true;

      var active = editorState ? feature.isActive(editorState) : false;

      return _react2.default.createElement(_DocsEditorToolBarButton2.default, {
        disabled: disabled,
        active: active,
        feature: feature,
        key: feature.action,
        onClick: _this._onButtonClick
      });
    }, _this._maybeWillRerender = function () {
      _this._timer.clear();
      _this._timer.set(_this._maybyRerender, 150);
    }, _this._maybyRerender = function () {
      // If editorState changed, force re-render.
      var editor = _this.props.getEditor();
      if (editor) {
        var _editor$props = editor.props,
            _editorState = _editor$props.editorState,
            _onChange = _editor$props.onChange;

        if (_editorState !== _this.state.focusedEditorState) {
          _this.setState({
            focusedEditorState: _editorState
          });
        }
      }
    }, _this._onButtonClick = function (feature) {
      _this._closeModal();

      var editor = _this.props.getEditor() || DUMMY_EDITOR;

      var _ref3 = feature === _DocsBehaviors.REDO || feature === _DocsBehaviors.UNDO ? _this.props : editor.props,
          editorState = _ref3.editorState,
          onChange = _ref3.onChange;

      if (!onChange || !editorState) {
        return;
      }

      var docsContext = _this.context.docsContext;


      _this._modalHandle = feature.update(editorState, onChange, docsContext);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsEditorToolBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Need to observe Selection change.
      // TODO: Build Selection observer.
      this._eventsCapture = (0, _captureDocumentEvents2.default)({
        mousedown: this._maybeWillRerender,
        mouseup: this._maybeWillRerender
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._timer.dispose();
      this._eventsCapture && this._eventsCapture.dispose();
      this._closeModal();
    }
  }, {
    key: 'render',
    value: function render() {
      var docsContext = this.context.docsContext;
      var canEdit = docsContext.canEdit,
          allowedActions = docsContext.allowedActions,
          runtime = docsContext.runtime;

      if (!canEdit) {
        return null;
      }
      var _props = this.props,
          editorState = _props.editorState,
          onChange = _props.onChange;

      return _react2.default.createElement(
        'div',
        { className: 'docs-editor-toolbar', 'data-docs-tool': 'true' },
        _react2.default.createElement(
          'div',
          { className: 'docs-editor-toolbar-body' },
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'block' },
            [_DocsBehaviors.H1, _DocsBehaviors.H2, _DocsBehaviors.H3, _DocsBehaviors.H4, _DocsBehaviors.UNORDERED_LIST, _DocsBehaviors.ORDERED_LIST, _DocsBehaviors.INDENT_LESS, _DocsBehaviors.INDENT_MORE, _DocsBehaviors.BLOCK_QUOTE].map(this._renderButton)
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'inline' },
            [_DocsBehaviors.LINK, _DocsBehaviors.BOLD, _DocsBehaviors.ITALIC, _DocsBehaviors.UNDERLINE, _DocsBehaviors.STRIKE, _DocsBehaviors.CODE].map(this._renderButton)
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'insert' },
            [_DocsBehaviors.IMAGE, _DocsBehaviors.TABLE, _DocsBehaviors.MATH, _DocsBehaviors.CALCULATOR, runtime && runtime.canLoadHTML && runtime.canLoadHTML() ? _DocsBehaviors.HTML_DOCUMENT : null, _DocsBehaviors.EXPANDABLE].map(this._renderButton)
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'history' },
            _react2.default.createElement(_DocsEditorToolBarButton2.default, {
              active: false,
              disabled: !_DocsBehaviors.UNDO.isEnabled(editorState),
              feature: _DocsBehaviors.UNDO,
              onClick: this._onButtonClick
            }),
            _react2.default.createElement(_DocsEditorToolBarButton2.default, {
              active: false,
              disabled: !_DocsBehaviors.REDO.isEnabled(editorState),
              feature: _DocsBehaviors.REDO,
              onClick: this._onButtonClick
            })
          )
        )
      );
    }
  }, {
    key: '_closeModal',
    value: function _closeModal() {
      this._modalHandle && this._modalHandle.dispose();
      this._modalHandle = null;
    }
  }]);
  return DocsEditorToolBar;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsEditorToolBar);