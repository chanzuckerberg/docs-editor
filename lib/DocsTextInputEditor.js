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

var _DocsInput = require('./DocsInput');

var _DocsInput2 = _interopRequireDefault(_DocsInput);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _reactBootstrap = require('react-bootstrap');

var _DocsHelpers = require('./DocsHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENTER_CODE = 23;

var DocsTextInputEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsTextInputEditor, _React$PureComponent);

  function DocsTextInputEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsTextInputEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsTextInputEditor.__proto__ || (0, _getPrototypeOf2.default)(DocsTextInputEditor)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _DocsHelpers.uniqueID)(), _this._timer = new _Timer2.default(), _this.state = {
      value: _this.props.value || ''
    }, _this._onKeyDown = function (e) {
      var keyCode = e.keyCode;
      var onConfirm = _this.props.onConfirm;

      keyCode === ENTER_CODE && onConfirm(_this.state.value);
    }, _this._onChange = function (e) {
      _this.setState({ value: e.target.value });
    }, _this._autoFocus = function () {
      var input = document.getElementById(_this._id);
      (0, _DocsHelpers.tryFocus)(input);
    }, _this._confirm = function () {
      _this.props.onConfirm(_this.state.value);
    }, _this._cancel = function () {
      _this.props.onCancel();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsTextInputEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._timer.set(this._autoFocus, 350);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._timer.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var value = this.state.value;

      var id = this._id;
      return _react2.default.createElement(
        'div',
        { className: 'docs-text-input-editor' },
        _react2.default.createElement(_DocsInput2.default, {
          id: id,
          onChange: this._onChange,
          onKeyDown: this._onKeyDown,
          type: 'text',
          value: value
        }),
        _react2.default.createElement(
          _reactBootstrap.Button,
          {
            bsSize: 'small',
            bsStyle: 'primary',
            onClick: this._confirm },
          'Done'
        ),
        _react2.default.createElement(
          _reactBootstrap.Button,
          {
            bsSize: 'small',
            onClick: this._cancel },
          'Cancel'
        )
      );
    }
  }]);
  return DocsTextInputEditor;
}(_react2.default.PureComponent);

module.exports = DocsTextInputEditor;