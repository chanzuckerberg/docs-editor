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
          icon = _props.icon,
          onClick = _props.onClick,
          title = _props.title;

      var allClassNames = (0, _classnames2.default)('docs-icon', className);

      var attrs = onClick ? (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.TOOL, true) : null;
      return _react2.default.createElement(
        'i',
        (0, _extends3.default)({}, attrs, {
          className: allClassNames,
          onClick: onClick,
          title: title }),
        icon
      );
    }
  }]);
  return DocsIcon;
}(_react2.default.PureComponent);

module.exports = DocsIcon;