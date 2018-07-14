'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _DocsMathEditorGuide = require('./DocsMathEditorGuide');

var _DocsMathEditorGuide2 = _interopRequireDefault(_DocsMathEditorGuide);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _DocsHelpers = require('./DocsHelpers');

require('./DocsMathEditor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MathEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_MathEntityData || require('prop-types').any;

// See http://cdn.summitlearning.org/assets/example_react_math_input_app_0_0_3_5.html


// This file is manually built and uploaded to S3.
// See https://github.com/FB-PLP/react-math-input-app
var GUPPY_CDN_URL = '//cdn.summitlearning.org/assets/app_react_math_input_app_0_0_3_8.html';

var DocsMathEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsMathEditor, _React$PureComponent);

  function DocsMathEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsMathEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsMathEditor.__proto__ || (0, _getPrototypeOf2.default)(DocsMathEditor)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _DocsHelpers.uniqueID)(), _this._inputValue = null, _this._unmounted = false, _this.state = {
      contentHeight: 0,
      contentWidth: 0,
      showGuide: false,
      symbolsGuide: null
    }, _this._confirm = function () {
      var _this$props = _this.props,
          entityData = _this$props.entityData,
          onConfirm = _this$props.onConfirm;

      onConfirm(_this._inputValue || entityData);
    }, _this._cancel = function () {
      _this.props.onCancel();
    }, _this._onGuideToggleClick = function (e) {
      e.preventDefault();
      var showGuide = _this.state.showGuide;

      _this.setState({ showGuide: !showGuide });
    }, _this._onMessage = function (e) {
      var data = void 0;
      try {
        data = JSON.parse(e.data);
      } catch (ex) {
        return;
      }
      if (!data || !data.detail || data.detail.id !== _this._id) {
        return;
      }

      var detail = data.detail;
      var value = detail.value,
          contentLayout = detail.contentLayout,
          symbolsGuide = detail.symbolsGuide;

      if (!_this.state.symbolsGuide) {
        _this.setState({
          symbolsGuide: symbolsGuide
        });
      }
      _this.setState({
        contentHeight: contentLayout.height,
        contentWidth: contentLayout.width
      });

      _this._inputValue = value;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsMathEditor, [{
    key: 'render',
    value: function render() {
      var entityData = this.props.entityData;
      var _state = this.state,
          showGuide = _state.showGuide,
          contentWidth = _state.contentWidth,
          contentHeight = _state.contentHeight,
          symbolsGuide = _state.symbolsGuide;

      var id = this._id;
      var params = (0, _stringify2.default)({
        value: entityData,
        id: id
      });

      var src = GUPPY_CDN_URL + '#' + window.encodeURIComponent(params);
      var toggleText = showGuide ? '[-] hide guide [-]' : '[+] show guide';
      var guideToggle = _react2.default.createElement(
        'a',
        { href: '#', onClick: this._onGuideToggleClick },
        toggleText
      );
      var iframeStyle = {
        height: Math.max(contentHeight, 80) + 'px',
        width: Math.max(contentWidth, 500) + 'px',
        opacity: symbolsGuide ? 1 : 0
      };
      // The math input must be hosted as a sandboxed app because it observe
      // DOM events at global level and it does not release the event handlers
      // when the editor si closed.
      return _react2.default.createElement(
        'div',
        {
          className: 'docs-math-editor',
          id: id },
        _react2.default.createElement(
          'div',
          { className: 'docs-math-editor-border' },
          _react2.default.createElement(
            'div',
            { className: 'docs-math-editor-scroll' },
            _react2.default.createElement('iframe', {
              className: 'docs-math-editor-iframe',
              src: src,
              style: iframeStyle
            })
          )
        ),
        this._renderGuide(),
        _react2.default.createElement(
          'div',
          { className: 'docs-math-editor-body' },
          _react2.default.createElement(
            'div',
            { className: 'docs-math-editor-toggle' },
            guideToggle
          ),
          _react2.default.createElement(
            _reactBootstrap.Button,
            {
              bsSize: 'small',
              bsStyle: 'primary',
              onClick: this._confirm },
            'Done'
          ),
          _react2.default.createElement(
            _reactBootstrap.Button,
            {
              bsSize: 'small',
              onClick: this._cancel },
            'Cancel'
          )
        )
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('message', this._onMessage, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      window.removeEventListener('message', this._onMessage, false);
    }
  }, {
    key: '_renderGuide',
    value: function _renderGuide() {
      var _state2 = this.state,
          showGuide = _state2.showGuide,
          symbolsGuide = _state2.symbolsGuide;

      if (!symbolsGuide || !showGuide) {
        return null;
      }
      return _react2.default.createElement(_DocsMathEditorGuide2.default, { symbolsGuide: symbolsGuide });
    }
  }]);
  return DocsMathEditor;
}(_react2.default.PureComponent);

module.exports = DocsMathEditor;