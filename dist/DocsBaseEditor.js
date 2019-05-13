'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DocsClipboardManager = require('./DocsClipboardManager');

var _DocsClipboardManager2 = _interopRequireDefault(_DocsClipboardManager);

var _DocsCustomStyleMap = require('./DocsCustomStyleMap');

var _DocsCustomStyleMap2 = _interopRequireDefault(_DocsCustomStyleMap);

var _DocsEditorBlockRenderer = require('./DocsEditorBlockRenderer');

var _DocsEditorBlockRenderer2 = _interopRequireDefault(_DocsEditorBlockRenderer);

var _DocsEditorFocusManager = require('./DocsEditorFocusManager');

var _DocsEditorFocusManager2 = _interopRequireDefault(_DocsEditorFocusManager);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

var _splitTextIntoTextBlocks = require('./splitTextIntoTextBlocks');

var _splitTextIntoTextBlocks2 = _interopRequireDefault(_splitTextIntoTextBlocks);

var _tryBlur = require('./tryBlur');

var _tryBlur2 = _interopRequireDefault(_tryBlur);

var _tryFocus = require('./tryFocus');

var _tryFocus2 = _interopRequireDefault(_tryFocus);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

require('./DocsBaseEditor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorProps = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorProps || require('prop-types').any;

// Patch
var selectionPrototype = Selection.prototype;
var selectionPrototypeExtend = selectionPrototype.extend;
selectionPrototype.extend = function tryExtendSelection(node, offset) {
  try {
    selectionPrototypeExtend.call(this, node, offset);
  } catch (ex) {
    (0, _warn2.default)(ex);
  }
};

// Patch

var DraftEditorPatched = function (_Editor) {
  (0, _inherits3.default)(DraftEditorPatched, _Editor);

  function DraftEditorPatched() {
    (0, _classCallCheck3.default)(this, DraftEditorPatched);
    return (0, _possibleConstructorReturn3.default)(this, (DraftEditorPatched.__proto__ || (0, _getPrototypeOf2.default)(DraftEditorPatched)).apply(this, arguments));
  }

  (0, _createClass3.default)(DraftEditorPatched, [{
    key: '_buildHandler',
    value: function _buildHandler(eventName) {
      var _this2 = this;

      // Hack to skiop errors while selection changes.
      var handler = (0, _get3.default)(DraftEditorPatched.prototype.__proto__ || (0, _getPrototypeOf2.default)(DraftEditorPatched.prototype), '_buildHandler', this).call(this, eventName);
      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        try {
          return handler.apply(_this2, args);
        } catch (ex) {
          (0, _warn2.default)(ex);
        }
      };
    }
  }]);
  return DraftEditorPatched;
}(_draftJs.Editor);

var clipboardManager = new _DocsClipboardManager2.default();
var focusManager = new _DocsEditorFocusManager2.default();

var DocsBaseEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsBaseEditor, _React$PureComponent);

  function DocsBaseEditor(props, context) {
    (0, _classCallCheck3.default)(this, DocsBaseEditor);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (DocsBaseEditor.__proto__ || (0, _getPrototypeOf2.default)(DocsBaseEditor)).call(this, props));

    _this3._editor = null;
    _this3._id = '';
    _this3._lastSelectionState = null;
    _this3._timer = new _Timer2.default();
    _this3.id = '';
    _this3.state = {
      focused: false
    };

    _this3._getID = function () {
      return _this3._id;
    };

    _this3._onEditorRef = function (ref) {
      _this3._editor = ref;
    };

    _this3._onPastedText = function (text, html) {
      var _window = window,
          event = _window.event;

      var editor = _this3._editor;
      if (event && editor) {
        // This block is forked from
        // `draft-js/src/component/handlers/edit/editOnPaste.js`.
        // If the text from the paste event is rich content that matches what we
        // already have on the internal clipboard, assume that we should just use
        // the clipboard fragment for the paste. This will allow us to preserve
        // styling and entities, if any are present. Note that newlines are
        // stripped during comparison -- this is because copy/paste within the
        // editor in Firefox and IE will not include empty lines. The resulting
        // paste will preserve the newlines correctly.
        var internalClipboard = editor.getClipboard();
        var clipboardData = clipboardManager.getClipboardData();
        if (clipboardData && clipboardData.isRichText() && internalClipboard) {
          if (html.indexOf(editor.getEditorKey()) > -1) {
            // If the editorKey is present in the pasted HTML, it should be safe
            // to assume this is an internal paste.
            return false;
          }
          var textBlocks = text ? (0, _splitTextIntoTextBlocks2.default)(text) : [];
          if (textBlocks.length === 1 && internalClipboard.size === 1 && internalClipboard.first().getText() === text) {
            return false;
          }
        }
      }

      var editorState = _this3.props.editorState;

      var newEditorState = (0, _DocsModifiers.pasteHTML)(editorState, html || (0, _splitTextIntoTextBlocks2.default)(text).join('<br />'));
      if (newEditorState !== editorState) {
        _this3._onChange(newEditorState);
        return true;
      }
      return false;
    };

    _this3._onKeyCommand = function (command) {
      // https://github.com/facebook/draft-js/issues/915
      var editorState = _this3.props.editorState;

      var newEditorState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
      if (newEditorState && newEditorState !== editorState) {
        _this3._timer.clear();
        _this3._timer.set(function () {
          _this3._onChange(newEditorState);
        });
        return 'handled';
      }
      return 'not-handled';
    };

    _this3._onChange = function (editorState) {
      _this3.props.onChange((0, _DocsModifiers.ensureAtomicBlocksAreSelectable)(editorState));
    };

    _this3._onTab = function (e) {
      var _this3$props = _this3.props,
          editorState = _this3$props.editorState,
          onChange = _this3$props.onChange;

      var maxDepth = 4;
      onChange(_draftJs.RichUtils.onTab(e, editorState, maxDepth));
    };

    _this3._renderBlock = function (conetntBlock) {
      var editorState = _this3.props.editorState;

      var blockProps = {
        editorState: editorState,
        onChange: _this3._onChange
      };
      return _DocsEditorBlockRenderer2.default.renderBlock(conetntBlock, blockProps);
    };

    _this3._doFocus = function () {
      if (!_this3._editor) {
        return;
      }
      (0, _tryFocus2.default)(_this3._editor);
      _this3._resumeFocusSelection();
    };

    _this3._doBlur = function () {
      if (!_this3._editor) {
        return;
      }
      (0, _tryBlur2.default)(_this3._editor);
    };

    _this3._id = props.id || (0, _uniqueID2.default)();

    var descriptor = {
      get: _this3._getID,
      set: _noop2.default,
      enumerable: true,
      configurable: false
    };
    Object.defineProperty(_this3, 'id', descriptor);
    return _this3;
  }

  (0, _createClass3.default)(DocsBaseEditor, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.id !== this.props.id) {
        focusManager.unregister(this._id, this);
        this._id = nextProps.id || (0, _uniqueID2.default)();
        focusManager.register(this._id, this);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      focusManager.register(this._id, this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      focusManager.unregister(this._id, this);
      this._timer.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var editorState = this.props.editorState;


      var props = {
        blockRenderMap: _DocsEditorBlockRenderer2.default.getBlockRenderMap(),
        blockRendererFn: this._renderBlock,
        blockStyleFn: _DocsEditorBlockRenderer2.default.getStyle,
        handleKeyCommand: this._onKeyCommand,
        handlePastedText: this._onPastedText,
        keyBindingFn: _draftJs.getDefaultKeyBinding
      };

      (0, _assign2.default)(props, this.props);

      // TODO: Also need to check user's role to see if this is readonly.)
      var readOnly = !this.state.focused || !this.context.docsContext.canEdit;
      var className = (0, _classnames2.default)({
        'docs-base-editor': true,
        'docs-font-default': true,
        'docs-base-editor-readonly': readOnly
      });

      return _react2.default.createElement(
        'div',
        {
          className: className,
          'data-docs-editor-for': this._id,
          id: this._id },
        _react2.default.createElement(DraftEditorPatched, (0, _extends3.default)({}, props, {
          customStyleMap: _DocsCustomStyleMap2.default,
          editorState: (0, _DocsModifiers.ensureAtomicBlocksAreSelectable)(editorState),
          onChange: this._onChange,
          onTab: this._onTab,
          readOnly: readOnly,
          ref: this._onEditorRef
        }))
      );
    }
  }, {
    key: 'focus',
    value: function focus(resumeSelection) {
      if (this._editor && !this.state.focused) {
        // Enable the editor.
        this.setState({ focused: true });
        this._doFocus();
      }
    }
  }, {
    key: 'blur',
    value: function blur() {
      var editorState = this.props.editorState;

      var selectionState = editorState.getSelection();
      this._lastSelectionState = selectionState;

      if (this._editor && this.state.focused) {
        this.setState({ focused: false });
        this._doBlur();
      }
    }
  }, {
    key: '_resumeFocusSelection',
    value: function _resumeFocusSelection() {
      var selectionState = this._lastSelectionState;
      if (!this.state.focused || !selectionState) {
        return;
      }
      this._lastSelectionState = null;
      var editorState = this.props.editorState;

      var nextEditorState = _draftJs.EditorState.forceSelection(editorState, selectionState);
      this._onChange(nextEditorState);
    }
  }]);
  return DocsBaseEditor;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsBaseEditor);