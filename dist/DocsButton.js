'use strict';

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

var _DocsIcon = require('./DocsIcon');

var _DocsIcon2 = _interopRequireDefault(_DocsIcon);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

var _reactBootstrap = require('react-bootstrap');

require('./DocsButton.css');

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

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsButton.__proto__ || (0, _getPrototypeOf2.default)(DocsButton)).call.apply(_ref, [this].concat(args))), _this), _this._mouseDownTarget = null, _this._onMouseDown = function (e) {
      _this._mouseDownTarget = e.target;
      e.preventDefault();
    }, _this._onMouseUp = function (e) {
      var lastTarget = _this._mouseDownTarget;
      if (!lastTarget) {
        return;
      }
      _this._mouseDownTarget = null;
      var target = e.target;
      if (lastTarget === target || lastTarget.contains(target) || target.contains(lastTarget)) {
        var _this$props = _this.props,
            _onClick = _this$props.onClick,
            _value = _this$props.value,
            _disabled = _this$props.disabled;

        !_disabled && _onClick(_value);
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          disabled = _props.disabled,
          icon = _props.icon,
          active = _props.active,
          label = _props.label;

      var iconName = icon || 'none';
      var className = (0, _classnames2.default)((0, _defineProperty3.default)({
        'docs-button': true,
        'docs-button-disabled': disabled,
        'docs-button-active': active,
        'active': active,
        'disabled': disabled
      }, iconName, true));
      var child = icon ? _react2.default.createElement(_DocsIcon2.default, { icon: icon }) : _react2.default.createElement(
        'span',
        { className: 'docs-button-text' },
        label
      );
      return _react2.default.createElement(
        _reactBootstrap.Button,
        {
          bsSize: 'xsmall',
          className: className,
          'data-docs-tool': 'true',
          disabled: disabled,
          onMouseDown: disabled ? _noop2.default : this._onMouseDown,
          onMouseUp: disabled ? _noop2.default : this._onMouseUp,
          title: label },
        _react2.default.createElement(
          'span',
          { id: id },
          child
        )
      );
    }
  }]);
  return DocsButton;
}(_react2.default.PureComponent);

module.exports = DocsButton;