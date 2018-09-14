'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractBehavior2 = require('./AbstractBehavior');

var _AbstractBehavior3 = _interopRequireDefault(_AbstractBehavior2);

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _DocsBlockTypes = require('./DocsBlockTypes');

var _DocsBlockTypes2 = _interopRequireDefault(_DocsBlockTypes);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _hasNoSelection = require('./hasNoSelection');

var _hasNoSelection2 = _interopRequireDefault(_hasNoSelection);

var _returnFalse = require('./returnFalse');

var _returnFalse2 = _interopRequireDefault(_returnFalse);

var _returnTrue = require('./returnTrue');

var _returnTrue2 = _interopRequireDefault(_returnTrue);

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

// case CALCULATOR_ALLOWED.SCIENTIFIC:
//         window.Desmos.ScientificCalculator(this.refs.calculator);
//         break;
//       case CALCULATOR_ALLOWED.FOUR_FUNCTION:
//         window.Desmos.FourFunctionCalculator(this.refs.calculator);
//         break;
//       case CALCULATOR_ALLOWED.GRAPHING:
//         window.Desmos.GraphingCalculator(this.refs.calculator);

var babelPluginFlowReactPropTypes_proptype_OnChange = require('./AbstractBehavior').babelPluginFlowReactPropTypes_proptype_OnChange || require('prop-types').any;

function insertCalculator(editorState) {
  return (0, _DocsModifiers.insertCustomBlock)(editorState, _DocsBlockTypes2.default.DOCS_CALCULATOR, {
    calculatorType: ''
  });
}

var CalculatorBehavior = function (_AbstractBehavior) {
  (0, _inherits3.default)(CalculatorBehavior, _AbstractBehavior);

  function CalculatorBehavior() {
    (0, _classCallCheck3.default)(this, CalculatorBehavior);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CalculatorBehavior.__proto__ || (0, _getPrototypeOf2.default)(CalculatorBehavior)).call(this, {
      action: _DocsActionTypes2.default.CALCULATOR_INSERT,
      icon: 'keyboard',
      label: 'Insert Calculator'
    }));

    _this.isEnabled = function (e) {
      return (0, _hasNoSelection2.default)(e);
    };

    _this.execute = function (editorState, onChange, d) {
      onChange(insertCalculator(editorState));
      return null;
    };

    return _this;
  }

  return CalculatorBehavior;
}(_AbstractBehavior3.default);

exports.default = CalculatorBehavior;