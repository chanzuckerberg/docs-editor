'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

function lookupElementByAttribute(element, attr, value) {
  var node = element;
  while (node) {
    if (node && node.nodeType === 1) {
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