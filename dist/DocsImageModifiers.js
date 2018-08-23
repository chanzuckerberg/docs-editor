'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsImageEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsImageEntityData || require('prop-types').any;

function setURL(entityData, url) {
  return (0, _extends3.default)({}, entityData, {
    height: undefined,
    url: url || undefined,
    width: undefined
  });
}

function setSize(entityData, width, height) {
  return (0, _extends3.default)({}, entityData, {
    width: width,
    height: height
  });
}

function setAlignment(entityData, align) {
  return (0, _extends3.default)({}, entityData, {
    align: align
  });
}

module.exports = {
  setAlignment: setAlignment,
  setSize: setSize,
  setURL: setURL
};