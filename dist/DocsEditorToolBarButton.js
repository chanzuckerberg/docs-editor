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

var _DocsButton = require('./DocsButton');

var _DocsButton2 = _interopRequireDefault(_DocsButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Spec', {
  value: require('prop-types').shape({
    action: require('prop-types').string.isRequired,
    icon: require('prop-types').string,
    label: require('prop-types').string.isRequired,
    modifier: require('prop-types').func,
    style: require('prop-types').string
  })
});

var DocsEditorToolBarButton = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsEditorToolBarButton, _React$PureComponent);

  function DocsEditorToolBarButton() {
    (0, _classCallCheck3.default)(this, DocsEditorToolBarButton);
    return (0, _possibleConstructorReturn3.default)(this, (DocsEditorToolBarButton.__proto__ || (0, _getPrototypeOf2.default)(DocsEditorToolBarButton)).apply(this, arguments));
  }

  (0, _createClass3.default)(DocsEditorToolBarButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          disabled = _props.disabled,
          spec = _props.spec,
          active = _props.active,
          onClick = _props.onClick;
      var label = spec.label,
          icon = spec.icon;

      return _react2.default.createElement(_DocsButton2.default, {
        active: active,
        disabled: disabled,
        icon: icon,
        id: id,
        label: label,
        onClick: onClick,
        value: spec
      });
    }
  }]);
  return DocsEditorToolBarButton;
}(_react2.default.PureComponent);

module.exports = DocsEditorToolBarButton;