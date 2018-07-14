'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _docsWithContext = require('./docsWithContext');

var _docsWithContext2 = _interopRequireDefault(_docsWithContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Get the maxWidth that the image could be resized to.
function getMaxResizeWidth(el) {
  // Ideally, the image should bot be wider then its containing element.
  var node = el.parentNode;
  while (node && !node.offsetParent) {
    node = node.parentNode;
  }
  if (node && node.offsetParent && node.offsetParent.offsetWidth && node.offsetParent.offsetWidth > 0) {
    return node.offsetParent.offsetWidth;
  }
  // Let the image resize freely.
  return 100000000;
}

var DocsImageResizeHandle = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsImageResizeHandle, _React$PureComponent);

  function DocsImageResizeHandle() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsImageResizeHandle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsImageResizeHandle.__proto__ || (0, _getPrototypeOf2.default)(DocsImageResizeHandle)).call.apply(_ref, [this].concat(args))), _this), _this._resizeContext = null, _this._eventsCapture = null, _this._timer = new _Timer2.default(), _this._onMouseDown = function (e) {
      if (_this._resizeContext) {
        // Already dragging.
        return;
      }
      var imageID = _this.props.imageID;

      var img = document.getElementById(imageID);
      if (!img) {
        return;
      }
      _this._blockEvent(e);

      var maxWidth = getMaxResizeWidth(img);

      var y0 = e.clientY;
      var domRect = img.getBoundingClientRect();
      var rect = {
        width: domRect.width,
        height: domRect.height
      };
      _this._resizeContext = {
        aspectRatio: rect.width / rect.height,
        cssText: img.style.cssText,
        maxWidth: maxWidth,
        img: img,
        h: 0,
        rect: rect,
        w: 0,
        y0: y0
      };
      _this._eventsCapture && _this._eventsCapture.dispose();
      _this._eventsCapture = (0, _captureDocumentEvents2.default)({
        mousemove: _this._onMouseMove,
        mouseup: _this._onMouseUp
      });
    }, _this._onMouseMove = function (e) {
      _this._blockEvent(e);
      var resizeContext = _this._resizeContext;
      if (!resizeContext) {
        return;
      }
      var y0 = resizeContext.y0,
          rect = resizeContext.rect,
          aspectRatio = resizeContext.aspectRatio,
          maxWidth = resizeContext.maxWidth;

      var y1 = e.clientY;
      var dy = y1 - y0;
      var h = Math.max(60, rect.height + dy);
      var w = aspectRatio * h;
      if (w > maxWidth) {
        w = maxWidth;
        h = w / aspectRatio;
      }
      w = Math.round(w);
      h = Math.round(h);
      _this._resizeContext = (0, _extends3.default)({}, resizeContext, {
        h: h,
        w: w
      });
      _this._timer.set(_this._applyResizeStyle);
    }, _this._onMouseUp = function (e) {
      _this._timer.clear();
      _this._blockEvent(e);
      _this._eventsCapture && _this._eventsCapture.dispose();
      _this._eventsCapture = null;

      var resizeContext = _this._resizeContext;
      _this._resizeContext = null;
      if (!resizeContext) {
        return;
      }
      _this._resizeContext = null;
      var img = resizeContext.img,
          w = resizeContext.w,
          h = resizeContext.h,
          cssText = resizeContext.cssText;


      if (!w || !h) {
        return;
      }

      // Resume styles.
      img.style.cssText = cssText;
      _this.props.onImageResizeEnd(w, h);
    }, _this._applyResizeStyle = function () {
      var resizeContext = _this._resizeContext;
      if (!resizeContext) {
        return;
      }
      var w = resizeContext.w,
          h = resizeContext.h,
          img = resizeContext.img;

      if (!w || !h) {
        return;
      }
      img.style.width = w + 'px';
      img.style.height = h + 'px';
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsImageResizeHandle, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._timer.dispose();
      this._eventsCapture && this._eventsCapture.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.context.docsContext.canEdit) {
        return null;
      }
      var className = (0, _classnames2.default)({
        'docs-image-resize-handle': true
      });

      return _react2.default.createElement('span', {
        className: className,
        'data-docs-tool': 'true',
        onMouseDown: this._onMouseDown,
        title: 'Resize image'
      });
    }
  }, {
    key: '_blockEvent',
    value: function _blockEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }]);
  return DocsImageResizeHandle;
}(_react2.default.PureComponent);

DocsImageResizeHandle.getMaxResizeWidth = getMaxResizeWidth;


module.exports = (0, _docsWithContext2.default)(DocsImageResizeHandle);