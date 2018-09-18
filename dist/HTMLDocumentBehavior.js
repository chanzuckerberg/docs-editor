'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var babelPluginFlowReactPropTypes_proptype_OnChange = require('./AbstractBehavior').babelPluginFlowReactPropTypes_proptype_OnChange || require('prop-types').any;

var HTMLDocumentBehavior = function (_AbstractBehavior) {
  (0, _inherits3.default)(HTMLDocumentBehavior, _AbstractBehavior);

  function HTMLDocumentBehavior() {
    (0, _classCallCheck3.default)(this, HTMLDocumentBehavior);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HTMLDocumentBehavior.__proto__ || (0, _getPrototypeOf2.default)(HTMLDocumentBehavior)).call(this, {
      action: _DocsActionTypes2.default.HTML_INSERT,
      icon: 'assignment',
      label: 'Insert HTML'
    }));

    _this.isEnabled = function (e) {
      return (0, _hasNoSelection2.default)(e);
    };

    _this.execute = function (editorState, onChange, docsContext) {
      var loadHTML = docsContext.runtime && docsContext.runtime.loadHTML;
      if (loadHTML) {
        (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
          var html;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return loadHTML();

                case 2:
                  html = _context.sent;

                  if (!(typeof html !== 'string' || !html)) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt('return');

                case 5:
                  onChange((0, _DocsModifiers.pasteHTML)(editorState, html));

                case 6:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }))();
      }
      return null;
    };

    return _this;
  }

  return HTMLDocumentBehavior;
}(_AbstractBehavior3.default);

exports.default = HTMLDocumentBehavior;