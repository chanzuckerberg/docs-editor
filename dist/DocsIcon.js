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

require('./DocsIcon.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsIcon = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsIcon, _React$PureComponent);

  function DocsIcon() {
    (0, _classCallCheck3.default)(this, DocsIcon);
    return (0, _possibleConstructorReturn3.default)(this, (DocsIcon.__proto__ || (0, _getPrototypeOf2.default)(DocsIcon)).apply(this, arguments));
  }

  (0, _createClass3.default)(DocsIcon, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          icon = _props.icon;

      var allClassNames = (0, _classnames2.default)('docs-icon', className);
      return _react2.default.createElement(
        'i',
        { className: allClassNames },
        icon
      );
    }
  }]);
  return DocsIcon;
}(_react2.default.PureComponent);

module.exports = DocsIcon;