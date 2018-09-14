'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _DocsResourcesLoader = require('./DocsResourcesLoader');

var _DocsResourcesLoader2 = _interopRequireDefault(_DocsResourcesLoader);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

require('./DocsCalculator.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_DocsResourcesLoader2.default.init();

var DocsCalculator = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsCalculator, _React$PureComponent);

  function DocsCalculator() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsCalculator);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsCalculator.__proto__ || (0, _getPrototypeOf2.default)(DocsCalculator)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _uniqueID2.default)(), _this.state = {
      editing: false,
      ready: _DocsResourcesLoader2.default.isReady()
    }, _this._maskEvent = function (e) {
      e.stopPropagation();
    }, _this._onDesmosLoad = function () {
      var Desmos = window.Desmos;
      if (!Desmos) {
        return;
      }

      var el = document.getElementById(_this._id);
      if (!el) {
        return;
      }
      el.innerHTML = '';
      Desmos.FourFunctionCalculator(el);
      // Desmos.GraphingCalculator(el);
      // case CALCULATOR_ALLOWED.SCIENTIFIC:
      //   Desmos.ScientificCalculator(this.refs.calculator);
      //   break;
      // case CALCULATOR_ALLOWED.FOUR_FUNCTION:
      //   Desmos.FourFunctionCalculator(this.refs.calculator);
      //   break;
      // case CALCULATOR_ALLOWED.GRAPHING:
      //   Desmos.GraphingCalculator(this.refs.calculator);
      //   break;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsCalculator, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _DocsResourcesLoader2.default.off(_DocsEventTypes2.default.LOAD, this._onDesmosLoad);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (window.Desmos) {
        this._onDesmosLoad();
      } else {
        _DocsResourcesLoader2.default.on(_DocsEventTypes2.default.LOAD, this._onDesmosLoad);
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.WIDGET, true);

      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({}, attrs, {
          className: 'docs-calculator',
          contentEditable: false,
          onInput: this._maskEvent,
          onKeyDown: this._maskEvent,
          onKeyPress: this._maskEvent,
          onKeyUp: this._maskEvent,
          tabIndex: 0 }),
        _react2.default.createElement('div', { id: this._id })
      );
    }
  }]);
  return DocsCalculator;
}(_react2.default.PureComponent);

exports.default = (0, _withDocsContext2.default)(DocsCalculator);