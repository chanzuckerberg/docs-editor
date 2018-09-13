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

var _DocsEditorToolBarFeatures = require('./DocsEditorToolBarFeatures');

require('./DocsEditorToolBar.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_EditorToolbarFeature = require('./DocsEditorToolBarFeatures').babelPluginFlowReactPropTypes_proptype_EditorToolbarFeature || require('prop-types').any;

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
      var allowedActions = _this.context.docsContext.allowedActions;

      if (!allowedActions.has(feature.action)) {
        return null;
      }
      var disabled = false;
      var active = false;
      // active={editorState ? feature.isActive(feature, editorState) : false}
      // disabled={editorState ? !feature.isEnabled(feature, editorState) : true}
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
    }, _this._onHistoryButtonClick = function (feature) {
      var docsContext = _this.context.docsContext;
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange;

      feature.update(feature, editorState, function (nextEditorState) {
        if (nextEditorState && nextEditorState !== editorState) {
          onChange(nextEditorState);
        }
      }, docsContext);
    }, _this._onButtonClick = function (feature) {
      _this._closeModal();

      var editor = _this.props.getEditor() || { props: {} };

      var _ref2 = feature === _DocsEditorToolBarFeatures.REDO || feature === _DocsEditorToolBarFeatures.UNDO ? _this.props : editor.props,
          editorState = _ref2.editorState,
          onChange = _ref2.onChange;

      if (!onChange || !editorState) {
        return;
      }

      var docsContext = _this.context.docsContext;


      _this._modalHandle = feature.update(feature, editorState, onChange, docsContext);
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
          allowedActions = docsContext.allowedActions;

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
            [_DocsEditorToolBarFeatures.UNORDERED_LIST, _DocsEditorToolBarFeatures.ORDERED_LIST, _DocsEditorToolBarFeatures.BLOCK_QUOTE, _DocsEditorToolBarFeatures.H1, _DocsEditorToolBarFeatures.H2, _DocsEditorToolBarFeatures.H3, _DocsEditorToolBarFeatures.H4].map(this._renderButton)
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'inline' },
            [_DocsEditorToolBarFeatures.LINK, _DocsEditorToolBarFeatures.BOLD, _DocsEditorToolBarFeatures.ITALIC, _DocsEditorToolBarFeatures.UNDERLINE, _DocsEditorToolBarFeatures.STRIKE, _DocsEditorToolBarFeatures.CODE].map(this._renderButton)
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'insert' },
            [_DocsEditorToolBarFeatures.IMAGE, _DocsEditorToolBarFeatures.TABLE, _DocsEditorToolBarFeatures.MATH, _DocsEditorToolBarFeatures.EXPANDABLE].map(this._renderButton)
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'history' },
            _react2.default.createElement(_DocsEditorToolBarButton2.default, {
              active: false,
              disabled: !_DocsEditorToolBarFeatures.UNDO.isEnabled(_DocsEditorToolBarFeatures.UNDO, editorState),
              feature: _DocsEditorToolBarFeatures.UNDO,
              onClick: this._onHistoryButtonClick
            }),
            _react2.default.createElement(_DocsEditorToolBarButton2.default, {
              active: false,
              disabled: !_DocsEditorToolBarFeatures.REDO.isEnabled(_DocsEditorToolBarFeatures.REDO, editorState),
              feature: _DocsEditorToolBarFeatures.REDO,
              onClick: this._onHistoryButtonClick
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