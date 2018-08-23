'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsDecoratorTypes = require('./DocsDecoratorTypes');

var _DocsDecoratorTypes2 = _interopRequireDefault(_DocsDecoratorTypes);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _camelize = require('./camelize');

var _camelize2 = _interopRequireDefault(_camelize);

var _convertImageElementToPlaceholderElement = require('./convertImageElementToPlaceholderElement');

var _convertImageElementToPlaceholderElement2 = _interopRequireDefault(_convertImageElementToPlaceholderElement);

var _getCSSRules = require('./getCSSRules');

var _getCSSRules2 = _interopRequireDefault(_getCSSRules);

var _getSafeDocumentElementFromHTML = require('./getSafeDocumentElementFromHTML');

var _getSafeDocumentElementFromHTML2 = _interopRequireDefault(_getSafeDocumentElementFromHTML);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocumentLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocumentLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_CSSRules = require('./getCSSRules').babelPluginFlowReactPropTypes_proptype_CSSRules || require('prop-types').any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_SafeHTML', {
  value: require('prop-types').shape({
    html: require('prop-types').string.isRequired,
    unsafeNodes: require('prop-types').any.isRequired,
    cssRules: babelPluginFlowReactPropTypes_proptype_CSSRules
  })
});


var ZERO_WIDTH_CHAR = '\u200B';

function mergeInlineStylesToElement(cssRules, el) {
  var classList = el.classList,
      style = el.style;

  if (!style || !classList || !classList.length) {
    // `el.style` could be `null` if `el` is `<math />`.
    return;
  }
  // We need to sort the linked styles based on their orders in CSSRules,
  // So later rules can overwrite previous one.
  var sortKey = _getCSSRules.CSS_SELECTOR_PRIORITY;
  var styleMaps = (0, _from2.default)(classList).map(function (className) {
    var selector = '.' + className;
    return cssRules.get(selector);
  }).filter(Boolean).sort(function (a, b) {
    return a.get(sortKey) >= b.get(sortKey) ? 1 : -1;
  });

  var styleNew = null;
  styleMaps.forEach(function (styleMap) {
    styleMap.forEach(function (styleValue, styleName) {
      if (styleName === _getCSSRules.CSS_SELECTOR_TEXT || styleName === _getCSSRules.CSS_SELECTOR_PRIORITY) {
        return;
      }
      var attr = (0, _camelize2.default)(styleName);
      if (style[attr]) {
        // Already has inline-style.
        return;
      }
      styleNew = styleNew || {};
      styleNew[attr] = styleValue;
    });
  });

  styleNew && (0, _assign2.default)(style, styleNew);
}

function getSafeHTML(html, domDocument) {
  var documentElement = (0, _getSafeDocumentElementFromHTML2.default)(html, domDocument);
  var body = documentElement ? documentElement.querySelector('body') : null;
  var ownerDocument = body && body.ownerDocument;
  var cssRules = (0, _getCSSRules2.default)(ownerDocument);
  var unsafeNodes = new _map2.default();
  var safeHTML = '';
  if (body) {
    // The provided chidlren nodes inside the atomic block should never be
    // rendered. Instead, the atomic block should only render with its entity
    // data. Therefore, move the children nodes into the quarantine pool
    // otherwise these chidlren wil be rendered as extra block after the atomic
    // block.
    var quarantine = function quarantine(node) {
      var id = (0, _uniqueID2.default)();
      node.id = id;
      unsafeNodes.set(id, node.cloneNode(true));
      node.innerHTML = ZERO_WIDTH_CHAR;
    };

    var atomicNodes = body.querySelectorAll('figure[' + _DocsDataAttributes2.default.ATOMIC_BLOCK_DATA + ']');
    (0, _from2.default)(atomicNodes).forEach(quarantine);

    // Apply all linked CSS styles to element.
    (0, _from2.default)(body.querySelectorAll('[class]')).forEach(mergeInlineStylesToElement.bind(null, cssRules));

    var tableNodes = body.querySelectorAll('table');
    (0, _from2.default)(tableNodes).forEach(quarantine);

    var mathNodes = body.querySelectorAll('span[' + _DocsDataAttributes2.default.DECORATOR_TYPE + '="' + _DocsDecoratorTypes2.default.DOCS_MATH + '"]');
    (0, _from2.default)(mathNodes).forEach(quarantine);

    var imgNodes = body.querySelectorAll('img');
    (0, _from2.default)(imgNodes).forEach(_convertImageElementToPlaceholderElement2.default);

    safeHTML = body.innerHTML;
  }

  return {
    cssRules: cssRules,
    html: safeHTML,
    unsafeNodes: unsafeNodes
  };
}

exports.default = getSafeHTML;