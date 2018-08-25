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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsButton = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsButton, _React$PureComponent);

  function DocsButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsButton.__proto__ || (0, _getPrototypeOf2.default)(DocsButton)).call.apply(_ref, [this].concat(args))), _this), _this._mouseDownTarget = null, _this._onChange = function (e) {
      var onChange = _this.props.onChange;

      onChange && onChange(e);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          value = _props.value,
          placeholder = _props.placeholder;


      return _react2.default.createElement(_reactBootstrap.FormControl, {
        onChange: this._onChange,
        placeholder: placeholder,
        type: 'text',
        value: value
      });
    }
  }]);
  return DocsButton;
}(_react2.default.PureComponent);

module.exports = DocsButton;