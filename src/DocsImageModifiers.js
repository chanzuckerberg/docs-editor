// @flow

import type {ImageEntityData} from './Types';

function setURL(entityData: ImageEntityData, url: string): ImageEntityData {
  return {
    ...entityData,
    height: undefined,
    url: url || undefined,
    width: undefined,
  };
}

function setSize(
  entityData: ImageEntityData,
  width: number,
  height: number,
): ImageEntityData {
  return {
    ...entityData,
    width,
    height,
  };
}

function setAlignment(
  entityData: ImageEntityData,
  align: string,
): ImageEntityData {
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
