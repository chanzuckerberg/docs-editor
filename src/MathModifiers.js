// @flow

import type {MathEntityData} from './Types';

function setMathValue(
  entityData: MathEntityData,
  newValue: MathEntityData,
): MathEntityData {
  return {
    ...entityData,
    ...newValue,
  };
}

module.exports = {
  setMathValue,
};
