'use strict';

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

var _DocsBaseEditor = require('./DocsBaseEditor');

var _DocsBaseEditor2 = _interopRequireDefault(_DocsBaseEditor);

var _DocsConfig = require('./DocsConfig');

var _DocsConfig2 = _interopRequireDefault(_DocsConfig);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsCustomStyleMap = require('./DocsCustomStyleMap');

var _DocsCustomStyleMap2 = _interopRequireDefault(_DocsCustomStyleMap);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsEditorContentOverflowControl = require('./DocsEditorContentOverflowControl');

var _DocsEditorContentOverflowControl2 = _interopRequireDefault(_DocsEditorContentOverflowControl);

var _DocsEditorFocusManager = require('./DocsEditorFocusManager');

var _DocsEditorFocusManager2 = _interopRequireDefault(_DocsEditorFocusManager);

var _DocsEditorToolBar = require('./DocsEditorToolBar');

var _DocsEditorToolBar2 = _interopRequireDefault(_DocsEditorToolBar);

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _DocsResourcesLoader = require('./DocsResourcesLoader');

var _DocsResourcesLoader2 = _interopRequireDefault(_DocsResourcesLoader);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ResizeObserver = require('./ResizeObserver');

var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _convertFromRaw = require('./convertFromRaw');

var _convertFromRaw2 = _interopRequireDefault(_convertFromRaw);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _isEditorStateEmpty = require('./isEditorStateEmpty');

var _isEditorStateEmpty2 = _interopRequireDefault(_isEditorStateEmpty);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

require('./DocsEditor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorProps = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorProps || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry = require('./ResizeObserver').babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry || require('prop-types').any;

_DocsConfig2.default.init();
_DocsResourcesLoader2.default.init();

var DEFAULT_CONTEXT = new _DocsContext2.default({});
var DEFAULT_EDITOR_STATE = (0, _convertFromRaw2.default)({});

var FOCUS_TRANSITION_DURATION_MS = _DocsEditorFocusManager2.default.FOCUS_TRANSITION_DURATION_MS;

var DocsEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsEditor, _React$PureComponent);

  function DocsEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsEditor.__proto__ || (0, _getPrototypeOf2.default)(DocsEditor)).call.apply(_ref, [this].concat(args))), _this), _this._activeEditor = null, _this._blurTimer = new _Timer2.default(), _this._editor = null, _this._element = null, _this._id = (0, _uniqueID2.default)(), _this._nodeListening = null, _this.state = {
      contentHeight: NaN,
      contentOverflowHidden: true,
      key: (0, _uniqueID2.default)()
    }, _this._getEditor = function () {
      return _this._activeEditor;
    }, _this._onChange = function (editorState) {
      var onChange = _this.props.onChange;

      onChange && onChange(editorState);
    }, _this._onEditorRef = function (ref) {
      if (ref) {
        // Mounting
        var el = (0, _asElement2.default)(_reactDom2.default.findDOMNode(ref));
        _ResizeObserver2.default.observe(el, _this._onContentResize);
      } else {
        // Unmounting.
        var _el = (0, _asElement2.default)(_reactDom2.default.findDOMNode(_this._editor));
        _ResizeObserver2.default.unobserve(_el);
      }
      _this._editor = ref;
    }, _this._onEditorIn = function (event) {
      var editor = event.detail ? event.detail.editor : null;
      if (_this._activeEditor !== editor) {
        _this._activeEditor = editor;
        _this.forceUpdate();
      }
      _this._blurTimer.clear();
    }, _this._onEditorOut = function (event) {
      if (_this._activeEditor) {
        _this._activeEditor = null;
        _this.forceUpdate();
      }

      // Schedule a call of `this._onBlur` if the editor is fully blurred.
      _this._blurTimer.clear();
      _this._blurTimer.set(_this._onBlur, FOCUS_TRANSITION_DURATION_MS);
    }, _this._onBlur = function () {
      var _this$props = _this.props,
          docsContext = _this$props.docsContext,
          onBlur = _this$props.onBlur;

      if (onBlur && docsContext && docsContext.canEdit) {
        onBlur();
      }
    }, _this._onElementRef = function (ref) {
      _this._unlisten();
      _this._element = ref;
      _this._listen();
    }, _this._onContentResize = function (info) {
      _this.setState({
        contentHeight: info.contentRect.height
      });
    }, _this._onContentOverflowToggle = function (contentOverflowHidden) {
      _this.setState({
        contentOverflowHidden: contentOverflowHidden
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsEditor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      window.requestAnimationFrame(_DocsCustomStyleMap2.default.injectCSSIntoDocument);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.docsContext !== this.props.docsContext) {
        // We're passing `this.props.docsContext` down to descending components
        // which can access it via `this.context.docsContext`.
        // However, React does not update the received context for the
        // descending components if they are made with `React.PureComponent`
        // which are commonly used in docs editor. To force the descending
        // components receive new context, this generates a new key that will
        // build a new component tree with updated context.
        // Note that `docsContext` does not change often, if it does change, it
        // often requires a full UI re-render.
        // see https://medium.com/@mweststrate/b7e343eff076 to learn more
        // about `context` and `PureComponent`.
        this.setState({ key: (0, _uniqueID2.default)() });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unlisten();
      this._blurTimer.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          disabled = _props.disabled,
          header = _props.header,
          height = _props.height,
          id = _props.id,
          onChange = _props.onChange,
          placeholder = _props.placeholder,
          width = _props.width;
      var _props2 = this.props,
          editorState = _props2.editorState,
          docsContext = _props2.docsContext;


      editorState = editorState || DEFAULT_EDITOR_STATE;
      docsContext = docsContext || DEFAULT_CONTEXT;

      // TODO: Needs a safter way to handle this.
      (0, _invariant2.default)(docsContext, 'prop `docsContext` is required');

      var activeEditor = this._activeEditor;
      var placeholderText = (0, _isEditorStateEmpty2.default)(editorState) && docsContext.canEdit && activeEditor ? placeholder || 'Type something' : '';

      var editorId = id || this._id;
      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.EDITOR_FOR, editorId);

      var useFixedLayout = width !== undefined || height !== undefined;

      var style = {
        width: width === undefined && useFixedLayout ? 'auto' : width,
        height: height === undefined && useFixedLayout ? 'auto' : height
      };

      var contentOverflowInfo = this._computeContentOverflowInfo();

      var mainClassName = (0, _classnames2.default)(className, {
        'docs-editor': true,
        'docs-font-default': true,
        'docs-editor-with-fixed-layout': useFixedLayout,
        'docs-editor-disabled': disabled
      });

      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({}, attrs, {
          key: this.state.key,
          style: style,
          className: mainClassName,
          ref: this._onElementRef }),
        _react2.default.createElement(
          'div',
          { className: 'docs-editor-frameset' },
          _react2.default.createElement(
            'div',
            { className: 'docs-editor-frame-head' },
            header,
            _react2.default.createElement(_DocsEditorToolBar2.default, (0, _extends3.default)({}, this.props, this.state, {
              editorState: editorState,
              getEditor: this._getEditor,
              onChange: this._onChange
            }))
          ),
          _react2.default.createElement(
            'div',
            { className: 'docs-editor-frame-body' },
            _react2.default.createElement(
              'div',
              {
                className: (0, _classnames2.default)('docs-editor-frame-body-scroll', contentOverflowInfo.className),
                style: contentOverflowInfo.style },
              _react2.default.createElement(_DocsBaseEditor2.default, {
                editorState: editorState,
                id: editorId,
                onChange: this._onChange,
                placeholder: placeholderText,
                ref: this._onEditorRef
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'docs-editor-frame-footer' },
            contentOverflowInfo.control
          )
        )
      );
    }
  }, {
    key: '_listen',
    value: function _listen() {
      var node = this._element ? _reactDom2.default.findDOMNode(this._element) : null;
      if (node) {
        node.addEventListener(_DocsEventTypes2.default.EDITOR_IN, this._onEditorIn, false);
        node.addEventListener(_DocsEventTypes2.default.EDITOR_OUT, this._onEditorOut, true);
        this._nodeListening = node;
      }
    }
  }, {
    key: '_unlisten',
    value: function _unlisten() {
      if (!this._nodeListening) {
        return;
      }
      var node = this._nodeListening;
      this._nodeListening = null;
      if (node) {
        node.removeEventListener(_DocsEventTypes2.default.EDITOR_IN, this._onEditorIn, false);
        node.removeEventListener(_DocsEventTypes2.default.EDITOR_OUT, this._onEditorOut, true);
      }
    }
  }, {
    key: '_computeContentOverflowInfo',
    value: function _computeContentOverflowInfo() {
      var maxContentHeight = this.props.maxContentHeight;
      var _state = this.state,
          contentHeight = _state.contentHeight,
          contentOverflowHidden = _state.contentOverflowHidden;

      if (contentHeight === null || maxContentHeight === null || maxContentHeight === undefined || contentHeight <= maxContentHeight) {
        // nothing to clamp.
        return {};
      }

      // Content could be clamped.
      var style = contentOverflowHidden ? {
        maxHeight: String(maxContentHeight) + 'px'
      } : null;

      var control = _react2.default.createElement(_DocsEditorContentOverflowControl2.default, {
        contentOverflowHidden: contentOverflowHidden,
        onToggle: this._onContentOverflowToggle
      });

      var className = contentOverflowHidden ? 'docs-editor-content-overflow-clamped' : null;

      return {
        style: style,
        control: control,
        className: className
      };
    }
  }]);
  return DocsEditor;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsEditor);