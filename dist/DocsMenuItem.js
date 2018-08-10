'use strict';

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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

var _reactBootstrap = require('react-bootstrap');

require('./DocsMenuItem.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsMenuItem = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsMenuItem, _React$PureComponent);

  function DocsMenuItem() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsMenuItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsMenuItem.__proto__ || (0, _getPrototypeOf2.default)(DocsMenuItem)).call.apply(_ref, [this].concat(args))), _this), _this._mouseDownTarget = null, _this._valueToEventKey = new _set2.default(), _this._onMouseDown = function (e) {
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
            _value = _this$props.value;
        // $FlowFixMe

        _onClick(_value);
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsMenuItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          divider = _props.divider,
          label = _props.label,
          className = _props.className;
      var _props2 = this.props,
          active = _props2.active,
          icon = _props2.icon;

      if (active !== undefined && !icon) {
        // use icon to replace the `active` style.
        icon = active ? 'check_box' : 'check_box_outline_blank';
        active = undefined;
      }

      var iconChild = icon ? _react2.default.createElement(_DocsIcon2.default, { className: 'docs-menuitem-icon', icon: icon }) : null;
      var labelChild = label ? _react2.default.createElement(
        'span',
        { className: 'docs-menuitem-text' },
        label
      ) : null;
      var cxName = (0, _classnames2.default)(className, 'docs-menuitem');
      if (divider) {
        return _react2.default.createElement(_reactBootstrap.MenuItem, {
          className: cxName,
          'data-docs-tool': 'true',
          divider: true
        });
      }

      return _react2.default.createElement(
        _reactBootstrap.MenuItem,
        {
          active: active,
          className: cxName,
          'data-docs-tool': 'true',
          onMouseDown: this._onMouseDown,
          onMouseUp: this._onMouseUp },
        iconChild,
        labelChild
      );
    }
  }]);
  return DocsMenuItem;
}(_react2.default.PureComponent);

module.exports = DocsMenuItem;