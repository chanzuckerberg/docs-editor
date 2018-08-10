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

require('./DocsAnnotation.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsAnnotationEtityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsAnnotationEtityData || require('prop-types').any;

// This component for highlighted text.
var DocsAnnotation = function (_React$Component) {
  (0, _inherits3.default)(DocsAnnotation, _React$Component);

  function DocsAnnotation() {
    (0, _classCallCheck3.default)(this, DocsAnnotation);
    return (0, _possibleConstructorReturn3.default)(this, (DocsAnnotation.__proto__ || (0, _getPrototypeOf2.default)(DocsAnnotation)).apply(this, arguments));
  }

  (0, _createClass3.default)(DocsAnnotation, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          entityData = _props.entityData;

      return _react2.default.createElement(
        'span',
        { className: 'docs-annotation' },
        children
      );
    }
  }]);
  return DocsAnnotation;
}(_react2.default.Component);

module.exports = DocsAnnotation;