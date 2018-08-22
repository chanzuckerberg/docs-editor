// @flow

import Color from 'color';
import createPaletteColors from './createPaletteColors';

window.Color = Color;
// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// https://stackoverflow.com/questions/19782975/convert-rgb-color-to-the-nearest-color-in-palette-web-safe-color

function getNearestColor(color: Color, sortedColors: Array<Color>, debug: any): ?Color {
  const head = sortedColors[0];
  const tail = sortedColors[sortedColors.length - 1];
  if (!head || !tail) {
    return null;
  }
  const hue = color.hue();
  // TODO: Use binary search.
  let delta = 1000;
  let result = null;
  for (var ii = 0, jj = sortedColors.length;  ii < jj; ii++) {
    const curr = sortedColors[ii];
    const currDelta = Math.abs(curr.hue() - hue);
    if (currDelta < delta) {
      delta = currDelta;
      result = curr;
    }
    if (delta === 0) {
      break;
    }
  }
  return result;
}

export default getNearestColor;
