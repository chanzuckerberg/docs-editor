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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

require('./DocsEditorContentOverflowControl.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsEditorContentOverflowControl = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsEditorContentOverflowControl, _React$PureComponent);

  function DocsEditorContentOverflowControl() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsEditorContentOverflowControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsEditorContentOverflowControl.__proto__ || (0, _getPrototypeOf2.default)(DocsEditorContentOverflowControl)).call.apply(_ref, [this].concat(args))), _this), _this._onClick = function (e) {
      var _this$props = _this.props,
          contentOverflowHidden = _this$props.contentOverflowHidden,
          onToggle = _this$props.onToggle;

      onToggle(!contentOverflowHidden);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsEditorContentOverflowControl, [{
    key: 'render',
    value: function render() {
      var contentOverflowHidden = this.props.contentOverflowHidden;

      var icon = contentOverflowHidden ? '\xBB' : '\xAB';
      var text = contentOverflowHidden ? 'Read more' : 'Read less';
      return _react2.default.createElement(
        _reactBootstrap.Button,
        {
          'aria-expanded': !contentOverflowHidden,
          bsStyle: 'link',
          className: 'docs-editor-content-overflow-control',
          onClick: this._onClick,
          onMouseDown: function onMouseDown(e) {
            return e.preventDefault();
          }
        },
        _react2.default.createElement(
          'span',
          { 'aria-hidden': 'true', className: 'icon' },
          icon
        ),
        text
      );
    }
  }]);
  return DocsEditorContentOverflowControl;
}(_react2.default.PureComponent);

module.exports = DocsEditorContentOverflowControl;