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

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsEditorToolBarButton = require('./DocsEditorToolBarButton');

var _DocsEditorToolBarButton2 = _interopRequireDefault(_DocsEditorToolBarButton);

var _DocsImageEditor = require('./DocsImageEditor');

var _DocsImageEditor2 = _interopRequireDefault(_DocsImageEditor);

var _DocsMathEditor = require('./DocsMathEditor');

var _DocsMathEditor2 = _interopRequireDefault(_DocsMathEditor);

var _DocsTextInputEditor = require('./DocsTextInputEditor');

var _DocsTextInputEditor2 = _interopRequireDefault(_DocsTextInputEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _showModalDialog = require('./showModalDialog');

var _showModalDialog2 = _interopRequireDefault(_showModalDialog);

var _reactBootstrap = require('react-bootstrap');

var _draftJs = require('draft-js');

var _getCurrentSelectionEntity = require('./getCurrentSelectionEntity');

var _getCurrentSelectionEntity2 = _interopRequireDefault(_getCurrentSelectionEntity);

var _DocsEditorToolBarHelpers = require('./DocsEditorToolBarHelpers');

var _DocsModifiers = require('./DocsModifiers');

require('./DocsEditorToolBar.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_Spec = require('./DocsEditorToolBarButton').babelPluginFlowReactPropTypes_proptype_Spec || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

function showLinkEditorModalDialog(url, callback) {
  return (0, _showModalDialog2.default)(_DocsTextInputEditor2.default, {
    title: 'Enter link URL or leave it empty to remove the link',
    value: url
  }, callback);
}

// This opens an image editor for the image that was just inserted by user.
function showImageEditorModalDialog(docsContext, editorState, onChange) {
  var contentState = editorState.getCurrentContent();
  var entityKey = contentState.getLastCreatedEntityKey();
  var entity = contentState.getEntity(entityKey);
  var entityData = entity.getData();
  return (0, _showModalDialog2.default)(_DocsImageEditor2.default, {
    docsContext: docsContext,
    entityData: entityData,
    title: 'Edit Image'
  }, function (newEntityData) {
    if (newEntityData) {
      var newEditorState = (0, _DocsModifiers.updateEntityData)(editorState, entityKey, newEntityData);
      onChange(newEditorState);
    }
  });
}

// This opens an math editor for the math placeholder that was just inserted by
// user.
function showMathEditorModalDialog(docsContext, editorState, onChange) {
  var contentState = editorState.getCurrentContent();
  var entityKey = contentState.getLastCreatedEntityKey();
  var entity = contentState.getEntity(entityKey);
  var entityData = entity.getData();
  return (0, _showModalDialog2.default)(_DocsMathEditor2.default, {
    docsContext: docsContext,
    entityData: entityData
  }, function (newEntityData) {
    if (newEntityData) {
      var newEditorState = (0, _DocsModifiers.updateEntityData)(editorState, entityKey, newEntityData);
      onChange(newEditorState);
    }
  });
}

function updateEditorLink(editor, url) {
  if (url === undefined) {
    return;
  }
  url = url || null;
  var _editor$props = editor.props,
      editorState = _editor$props.editorState,
      onChange = _editor$props.onChange;

  var newEditorState = (0, _DocsModifiers.updateLink)(editorState, url);
  if (newEditorState && newEditorState !== editorState) {
    onChange(newEditorState);
  }
}

var DocsEditorToolBar = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsEditorToolBar, _React$PureComponent);

  function DocsEditorToolBar() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsEditorToolBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsEditorToolBar.__proto__ || (0, _getPrototypeOf2.default)(DocsEditorToolBar)).call.apply(_ref, [this].concat(args))), _this), _this._editCapability = (0, _DocsEditorToolBarHelpers.getEditCapability)(null), _this._eventsCapture = null, _this._imageEditorModal = null, _this._linkEditorModal = null, _this._mathEditorModal = null, _this._timer = new _Timer2.default(), _this._timerID = 0, _this.state = {
      editorState: null
    }, _this._renderHistoryButton = function (spec) {
      var history = _this._editCapability.history;

      return _react2.default.createElement(_DocsEditorToolBarButton2.default, {
        active: false,
        disabled: !history || !history.has(spec.action),
        key: spec.action,
        onClick: _this._onButtonClick,
        spec: spec
      });
    }, _this._renderAnnotationButton = function (spec) {
      var annotation = _this._editCapability.annotation;

      return _react2.default.createElement(_DocsEditorToolBarButton2.default, {
        active: false,
        disabled: !annotation,
        key: spec.action,
        onClick: _this._onButtonClick,
        spec: spec
      });
    }, _this._renderBlockStyleButton = function (spec) {
      var blockStyles = _this._editCapability.blockStyles;

      return _react2.default.createElement(_DocsEditorToolBarButton2.default, {
        active: blockStyles ? blockStyles.has(spec.style) : false,
        disabled: !blockStyles,
        key: spec.action,
        onClick: _this._onButtonClick,
        spec: spec
      });
    }, _this._renderInlineStyleButton = function (spec) {
      var inlineStyles = _this._editCapability.inlineStyles;

      var active = inlineStyles ? inlineStyles.has(spec.style) : false;
      return _react2.default.createElement(_DocsEditorToolBarButton2.default, {
        active: active,
        disabled: inlineStyles === null,
        key: spec.action,
        onClick: _this._onButtonClick,
        spec: spec
      });
    }, _this._renderInsertButton = function (spec) {
      var editCapability = _this._editCapability;
      var disabled = true;
      switch (spec.action) {
        case _DocsActionTypes2.default.TABLE_INSERT:
          disabled = !editCapability.table;
          break;
        default:
          disabled = !editCapability.insert;
          break;
      }
      return _react2.default.createElement(_DocsEditorToolBarButton2.default, {
        disabled: disabled,
        key: spec.action,
        onClick: _this._onButtonClick,
        spec: spec
      });
    }, _this._onButtonClick = function (spec) {
      var editor = _this.props.getEditor();
      if (!editor) {
        return;
      }
      var _editor$props2 = editor.props,
          onChange = _editor$props2.onChange,
          editorState = _editor$props2.editorState;

      if (!onChange || !editorState) {
        return;
      }

      if (spec.action === _DocsActionTypes2.default.TEXT_LINK) {
        var linkEntity = (0, _getCurrentSelectionEntity2.default)(editorState);
        var url = linkEntity && linkEntity.getData().url || '';
        _this._linkEditorModal && _this._linkEditorModal.dispose();
        _this._linkEditorModal = showLinkEditorModalDialog(url, updateEditorLink.bind(null, editor));
        return;
      }

      if (spec.action === _DocsActionTypes2.default.IMAGE_INSERT && spec.modifier) {
        // Insert an empty image placeholder.
        var docsContext = _this.context.docsContext;

        var _newEditorState = spec.modifier(editorState);
        // Opens a modal to edit it.
        _this._imageEditorModal && _this._imageEditorModal.dispose();
        _this._imageEditorModal = showImageEditorModalDialog(docsContext, _newEditorState, onChange);
        return;
      }

      if (spec.action === _DocsActionTypes2.default.MATH_INSERT && spec.modifier) {
        // Insert an empty math placeholder.
        var _docsContext = _this.context.docsContext;

        var _newEditorState2 = spec.modifier(editorState);
        // Opens a modal to edit it.
        _this._mathEditorModal && _this._mathEditorModal.dispose();
        _this._mathEditorModal = showMathEditorModalDialog(_docsContext, _newEditorState2, onChange);
        return;
      }

      var newEditorState = (0, _DocsEditorToolBarHelpers.maybeInsertBlock)(spec, editorState) || (0, _DocsEditorToolBarHelpers.maybeFormatInlineText)(spec, editorState) || (0, _DocsEditorToolBarHelpers.maybeFormatBlockText)(spec, editorState) || (0, _DocsEditorToolBarHelpers.maybeUpdateHistory)(spec, editorState) || (0, _DocsEditorToolBarHelpers.maybeUpdateAnnotation)(spec, editorState);

      if (newEditorState && newEditorState !== editorState) {
        onChange(newEditorState);
      }
    }, _this._maybeWillRerender = function () {
      _this._timer.clear();
      _this._timer.set(_this._maybyRerender, 150);
    }, _this._maybyRerender = function () {
      // If editorState changed, re-render.
      _this._timerID = 0;
      var editor = _this.props.getEditor();
      if (editor) {
        var editorState = editor.props.editorState;

        _this.setState({ editorState: editorState || null });
      }
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
      this._imageEditorModal && this._imageEditorModal.dispose();
      this._linkEditorModal && this._linkEditorModal.dispose();
      this._eventsCapture && this._eventsCapture.dispose();
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

      var editor = this.props.getEditor();
      this._editCapability = (0, _DocsEditorToolBarHelpers.getEditCapability)(editor);
      var specFilter = function specFilter(_ref2) {
        var action = _ref2.action;
        return allowedActions.has(action);
      };
      var insertButtons = _DocsEditorToolBarHelpers.INSERT_SPECS.filter(specFilter).map(this._renderInsertButton);
      var inlineButtons = _DocsEditorToolBarHelpers.INLINE_SPECS.filter(specFilter).map(this._renderInlineStyleButton);
      var blockButtons = _DocsEditorToolBarHelpers.BLOCK_SPECS.filter(specFilter).map(this._renderBlockStyleButton);
      var historyButtons = _DocsEditorToolBarHelpers.HISTORY_SPECS.filter(specFilter).map(this._renderHistoryButton);
      var annotationButtons = _DocsEditorToolBarHelpers.ANNOTATION_SPECS.filter(specFilter).map(this._renderAnnotationButton);
      return _react2.default.createElement(
        'div',
        { className: 'docs-editor-toolbar', 'data-docs-tool': 'true' },
        _react2.default.createElement(
          'div',
          { className: 'docs-editor-toolbar-body' },
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'block' },
            blockButtons
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'inline' },
            inlineButtons,
            annotationButtons
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'insert' },
            insertButtons
          ),
          _react2.default.createElement(
            _reactBootstrap.ButtonGroup,
            { className: 'docs-buttons-group', key: 'history' },
            historyButtons
          )
        )
      );
    }
  }]);
  return DocsEditorToolBar;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsEditorToolBar);