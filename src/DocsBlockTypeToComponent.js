// @flow

import docsAtomicBlock from './docsAtomicBlock';
import invariant from 'invariant';
import nullthrows from 'nullthrows';

const globalMapping: Map<string, Function> = new Map();
const hocMappingg: Map<string, Function> = new Map();

// Lazily create the HOC for Component.
function getHOC(blockType: string): Function {
  if (!hocMappingg.has(blockType)) {
    const Component = nullthrows(globalMapping.get(blockType));
    const spec = {blockType};
    hocMappingg.set(blockType, docsAtomicBlock(Component, spec));
  }
  return nullthrows(hocMappingg.get(blockType));
}

function register(type: string, Component: Function): void {
  invariant(type && typeof type === 'string', 'invalid type %s', type);
  invariant(Component && typeof Component === 'function', 'invalid Component');
  globalMapping.set(type, Component);
}

function getComponent(blockType: string): ?Function {
  return globalMapping.has(blockType) ?
    getHOC(blockType) :
    null;
}

module.exports = {
  getComponent,
  register,
};
