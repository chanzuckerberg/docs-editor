// @flow

import type {DocsImageEntityData} from './Types';

function setURL(entityData: DocsImageEntityData, url: string): DocsImageEntityData {
  return {
    ...entityData,
    height: undefined,
    url: url || undefined,
    width: undefined,
  };
}

function setSize(
  entityData: DocsImageEntityData,
  width: number,
  height: number,
): DocsImageEntityData {
  return {
    ...entityData,
    width,
    height,
  };
}

function setAlignment(
  entityData: DocsImageEntityData,
  align: string,
): DocsImageEntityData {
  return {
    ...entityData,
    align,
  };
}

module.exports = {
  setAlignment,
  setSize,
  setURL,
};
