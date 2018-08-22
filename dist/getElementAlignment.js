'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

var ALIGNMENT_VALUE_PATTERN = /left|center|right/i;

function getElementAlignment(el) {
  var attributeValue = el.getAttribute('align');
  if (attributeValue && ALIGNMENT_VALUE_PATTERN.test(attributeValue)) {
    // For IMG, TD
    return attributeValue;
  }
  // TODO: Parse it from external stylesheet.
  return null;
}

exports.default = getElementAlignment;