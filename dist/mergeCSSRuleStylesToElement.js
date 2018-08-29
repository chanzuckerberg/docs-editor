'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _DocsCustomStyleMap = require('./DocsCustomStyleMap');

var _DocsCustomStyleMap2 = _interopRequireDefault(_DocsCustomStyleMap);

var _camelize = require('./camelize');

var _camelize2 = _interopRequireDefault(_camelize);

var _getCSSRules = require('./getCSSRules');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocumentLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocumentLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_StyleMap = require('./getCSSRules').babelPluginFlowReactPropTypes_proptype_StyleMap || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_CSSRules = require('./getCSSRules').babelPluginFlowReactPropTypes_proptype_CSSRules || require('prop-types').any;

var CHAR_BULLET = '\u25CF';
var CHAR_CIRCLE = '\u25CB';

function sortCSSRuleStyleMap(one, two) {
  var p1 = one.get(_getCSSRules.CSS_SELECTOR_PRIORITY);
  var p2 = two.get(_getCSSRules.CSS_SELECTOR_PRIORITY);
  return p1 >= p2 ? 1 : -1;
}

function mergeCSSRuleStylesToElement(cssRules, el) {
  var classList = el.classList,
      style = el.style;

  if (!style || !classList || !classList.length) {
    // `el.style` could be `null` if `el` is `<math />`.
    return;
  }
  // We need to sort the linked styles based on their orders in CSSRules,
  // So later rules can overwrite previous one.
  var elStyle = style;
  var nodeName = el.nodeName.toLowerCase();
  var finderCache = {};
  var sortedStyleMaps = (0, _from2.default)(classList).reduce(function (memo, className) {
    // Try `.class-name`
    var styleMap = cssRules.get('.' + className);
    if (styleMap) {
      memo.push(styleMap);
    }
    // Try `ul.class-name`
    styleMap = cssRules.get(nodeName + '.' + className);
    if (styleMap) {
      memo.push(styleMap);
    }

    // Try `.class-name > li::before`
    // This handles the special case that google docs uses `content: "."`
    // as the bullet for the list item.
    styleMap = cssRules.get('.' + className + ' > li::before');

    var listStyleType = void 0;
    var content = styleMap ? String(styleMap.get('content')) : null;
    if (content) {
      if (finderCache[content]) {
        listStyleType = finderCache[content];
      } else if (content.indexOf(CHAR_CIRCLE) >= 0) {
        listStyleType = 'circle';
        finderCache[content] = listStyleType;
      } else if (content.indexOf(CHAR_BULLET) >= 0) {
        listStyleType = 'disc';
        finderCache[content] = listStyleType;
      } else {
        var finder = function finder(type) {
          return content.indexOf(type) >= 0;
        };
        var found = _DocsCustomStyleMap2.default.LIST_STYLE_TYPE_VALUES.find(finder);
        if (found) {
          listStyleType = found;
          finderCache[content] = listStyleType;
        }
      }
    }

    if (listStyleType) {
      // $FlowFixMe
      memo.push((0, _immutable.OrderedMap)({ 'list-style-type': listStyleType }));
    }

    return memo;
  }, []).sort(sortCSSRuleStyleMap);

  var styleNew = null;
  sortedStyleMaps.forEach(function (styleMap) {
    styleMap.forEach(function (styleValue, styleName) {
      if (styleName === _getCSSRules.CSS_SELECTOR_TEXT || styleName === _getCSSRules.CSS_SELECTOR_PRIORITY) {
        return;
      }

      if (styleName === 'background-color' && nodeName !== 'span') {
        return;
      }

      var attr = (0, _camelize2.default)(styleName);
      if (elStyle[attr]) {
        // The source HTML alway has inline-style defined, don't overwrite it.
        return;
      }
      styleNew = styleNew || {};
      styleNew[attr] = styleValue;
    });
  });

  styleNew && (0, _assign2.default)(style, styleNew);
}

exports.default = mergeCSSRuleStylesToElement;