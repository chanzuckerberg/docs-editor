// @flow

import Color from 'color';

// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// https://stackoverflow.com/questions/19782975/convert-rgb-color-to-the-nearest-color-in-palette-web-safe-color

function getNearestColor(
  color: Color,
  palleteColors: Array<Color>,
): ?Color {
  const hue = color.hue();
  // TODO: Use binary search when palleteColors is sorted.
  let delta = 1000;
  let result = null;
  for (var ii = 0, jj = palleteColors.length;  ii < jj; ii++) {
    const curr = palleteColors[ii];
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
