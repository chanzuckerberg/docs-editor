'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

function lookupElementByAttribute(element, attr, value) {
  var node = element;
  while (node) {
    if (node && node.nodeType === 1) {
      if (attr === 'class' || attr === 'className') {
        var _node = node,
            classList = _node.classList;

        if (classList && value && classList.contains(value)) {
          return node;
        }
        if (classList && value === undefined && classList.length > 0) {
          return node;
        }
        if (!classList) {
          // TODO: Fallback?
          return null;
        }
      }
      if (value === undefined && node.hasAttribute(attr)) {
        return node;
      } else if (node.getAttribute(attr) === value) {
        return node;
      }
    }
    node = node.parentElement;
  }
  return null;
}

exports.default = lookupElementByAttribute;