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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsLinkEtityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsLinkEtityData || require('prop-types').any;

var DocsLink = function (_React$Component) {
  (0, _inherits3.default)(DocsLink, _React$Component);

  function DocsLink() {
    (0, _classCallCheck3.default)(this, DocsLink);
    return (0, _possibleConstructorReturn3.default)(this, (DocsLink.__proto__ || (0, _getPrototypeOf2.default)(DocsLink)).apply(this, arguments));
  }

  (0, _createClass3.default)(DocsLink, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          entityData = _props.entityData,
          children = _props.children;
      var url = entityData.url;

      return _react2.default.createElement(
        'a',
        {
          'data-docs-link': 'true',
          href: url || '#',
          target: '_blank' },
        children
      );
    }
  }]);
  return DocsLink;
}(_react2.default.Component);

module.exports = DocsLink;