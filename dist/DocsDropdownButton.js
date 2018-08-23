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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactBootstrap = require('react-bootstrap');

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsDropdownButton = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsDropdownButton, _React$PureComponent);

  function DocsDropdownButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsDropdownButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsDropdownButton.__proto__ || (0, _getPrototypeOf2.default)(DocsDropdownButton)).call.apply(_ref, [this].concat(args))), _this), _this._mouseDownTarget = null, _this._id = (0, _uniqueID2.default)(), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsDropdownButton, [{
    key: 'render',
    value: function render() {
      var className = (0, _classnames2.default)(this.props.className, 'docs-dropdown-button');
      return _react2.default.createElement(_reactBootstrap.DropdownButton, (0, _extends3.default)({
        className: className,
        'data-docs-tool': 'true',
        id: this._id
      }, this.props));
    }
  }]);
  return DocsDropdownButton;
}(_react2.default.PureComponent);

module.exports = DocsDropdownButton;