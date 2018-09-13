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

var _DocsButton = require('./DocsButton');

var _DocsButton2 = _interopRequireDefault(_DocsButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsBehavior = require('./DocsBehaviors').babelPluginFlowReactPropTypes_proptype_DocsBehavior || require('prop-types').any;

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
          feature = _props.feature,
          onClick = _props.onClick,
          id = _props.id,
          active = _props.active,
          disabled = _props.disabled;
      var label = feature.label,
          icon = feature.icon;


      return _react2.default.createElement(_DocsButton2.default, {
        active: active,
        disabled: disabled,
        icon: feature.icon,
        id: id,
        label: label,
        onClick: onClick,
        value: feature
      });
    }
  }]);
  return DocsEditorToolBarButton;
}(_react2.default.PureComponent);

module.exports = DocsEditorToolBarButton;