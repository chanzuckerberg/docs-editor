'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

function getElementDimension(el, dimension) {
  var attributeValue = el.getAttribute(dimension);
  if (attributeValue && /\d+/.test(attributeValue)) {
    return parseInt(attributeValue, 10);
  }
  var styleValue = el.style[dimension];
  if (styleValue && /\d+px/.test(styleValue)) {
    return parseFloat(styleValue);
  }
  // TODO: Parse it from external stylesheet.
  return null;
}

exports.default = getElementDimension;