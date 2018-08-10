'use strict';

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _docsAtomicBlock = require('./docsAtomicBlock');

var _docsAtomicBlock2 = _interopRequireDefault(_docsAtomicBlock);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalMapping = new _map2.default();

var hocMappingg = new _map2.default();

// Lazily create the HOC for Component.
function getHOC(blockType) {
  if (!hocMappingg.has(blockType)) {
    var Component = (0, _nullthrows2.default)(globalMapping.get(blockType));
    var spec = { blockType: blockType };
    hocMappingg.set(blockType, (0, _docsAtomicBlock2.default)(Component, spec));
  }
  return (0, _nullthrows2.default)(hocMappingg.get(blockType));
}

function register(type, Component) {
  (0, _invariant2.default)(type && typeof type === 'string', 'invalid type %s', type);
  (0, _invariant2.default)(Component && typeof Component === 'function', 'invalid Component');
  globalMapping.set(type, Component);
}

function getComponent(blockType) {
  return globalMapping.has(blockType) ? getHOC(blockType) : null;
}

module.exports = {
  getComponent: getComponent,
  register: register
};