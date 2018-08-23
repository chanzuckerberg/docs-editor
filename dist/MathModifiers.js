'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsMathEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsMathEntityData || require('prop-types').any;

function setMathValue(entityData, newValue) {
  return (0, _extends3.default)({}, entityData, newValue);
}

module.exports = {
  setMathValue: setMathValue
};