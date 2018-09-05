'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _lookupElementByAttribute = require('./lookupElementByAttribute');

var _lookupElementByAttribute2 = _interopRequireDefault(_lookupElementByAttribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

function lookupResizeableTableCellElement(el) {
  var table = (0, _lookupElementByAttribute2.default)(el, _DocsDataAttributes2.default.TABLE);
  if (!table) {
    return null;
  }
  var tBodies = table.tBodies;

  if (!tBodies) {
    return null;
  }
  var body = tBodies[0];
  if (!body) {
    return null;
  }
  var selector = '.docs-table-resize-placeholder-cell';
  var resizeCells = (0, _from2.default)(body.querySelectorAll(selector));

  var _el$getBoundingClient = el.getBoundingClientRect(),
      left = _el$getBoundingClient.left,
      right = _el$getBoundingClient.right;

  return resizeCells.find(function (cell) {
    var cellRect = (0, _asElement2.default)(cell).getBoundingClientRect();
    if (left >= cellRect.left && right <= cellRect.right) {
      return cell;
    }
  });
}

exports.default = lookupResizeableTableCellElement;