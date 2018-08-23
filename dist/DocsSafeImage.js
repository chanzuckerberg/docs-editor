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

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

require('./DocsSafeImage.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ImageLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ImageLike || require('prop-types').any;

/**
 * This component load and render image safely
 * - It loads image that can be proxied as a safe image.
 * - It manages the async image loading without worrying about race-condition.
 */
var DocsSafeImage = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsSafeImage, _React$PureComponent);

  function DocsSafeImage() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsSafeImage);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsSafeImage.__proto__ || (0, _getPrototypeOf2.default)(DocsSafeImage)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      error: false,
      pending: true
    }, _this._ref = null, _this._renderedSrc = null, _this._unmounted = false, _this._onLoad = function (src) {
      if (!_this._unmounted && src === _this._renderedSrc) {
        _this.setState({ error: false, pending: false }, _this._didLoad);
      }
    }, _this._onError = function (src) {
      if (!_this._unmounted && src === _this._renderedSrc) {
        _this.setState({ error: true, pending: false }, _this._didError);
      }
    }, _this._onRef = function (ref) {
      _this._ref = ref;
    }, _this._didLoad = function () {
      var _this$props = _this.props,
          onLoad = _this$props.onLoad,
          src = _this$props.src,
          id = _this$props.id;

      if (onLoad) {
        var element = (0, _nullthrows2.default)(_reactDom2.default.findDOMNode(_this._ref));
        onLoad({
          src: (0, _nullthrows2.default)(src),
          height: (0, _nullthrows2.default)(element.naturalHeight),
          width: (0, _nullthrows2.default)(element.naturalWidth),
          id: id || ''
        });
      }
    }, _this._didError = function () {
      var _this$props2 = _this.props,
          onError = _this$props2.onError,
          src = _this$props2.src;

      if (onError) {
        var msg = src ? 'failed to load image from ' + String(src) : 'Image url can\'t be empty';
        onError(new Error(msg));
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsSafeImage, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.src !== this.props.src) {
        this.setState({ error: false, pending: true });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          alt = _props.alt,
          className = _props.className,
          id = _props.id,
          width = _props.width,
          height = _props.height,
          onClick = _props.onClick;
      var _state = this.state,
          error = _state.error,
          pending = _state.pending;
      var runtime = this.context.docsContext.runtime;
      var src = this.props.src;


      if (src && runtime && runtime.canProxyImageSrc(src)) {
        src = runtime.getProxyImageSrc(src);
      }
      src = String(src || '');

      var altText = error ? 'unable to load image from ' + src : alt;

      var empty = !src;

      var cxName = (0, _classnames2.default)(className, {
        'docs-safe-image': true,
        'docs-safe-image-pending': pending,
        'docs-safe-image-error': error,
        'docs-safe-image-empty': empty,
        'error': error
      });

      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.ELEMENT, true);
      var style = void 0;
      if (width && height) {
        style = {
          width: width + 'px',
          height: height + 'px'
        };
      } else if (width) {
        style = {
          width: width + 'px'
        };
      } else if (height) {
        style = {
          height: height + 'px'
        };
      } else {
        style = {
          maxWidth: '100%'
        };
      }

      // An image is loaded asynchronously. We need to keep track of the current
      // image src that is being rendered.
      this._renderedSrc = src;

      return error || empty ? _react2.default.createElement(
        'span',
        (0, _extends3.default)({}, attrs, {
          className: cxName,
          id: id,
          onClick: onClick,
          style: style,
          title: altText }),
        src
      ) : _react2.default.createElement('img', (0, _extends3.default)({}, attrs, {
        alt: altText,
        className: cxName,
        id: id,
        key: src,
        onClick: onClick,
        onError: this._onError.bind(this, src),
        onLoad: this._onLoad.bind(this, src),
        ref: this._onRef,
        src: src,
        style: style
      }));
    }
  }]);
  return DocsSafeImage;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsSafeImage);