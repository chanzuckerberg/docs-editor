// @flow

import Color from 'color';

// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// https://stackoverflow.com/questions/19782975/convert-rgb-color-to-the-nearest-color-in-palette-web-safe-color
// TODO: Use binary search when palleteColors is sorted.

function getNearestColorByHue(
  color: Color,
  palleteColors: Array<Color>,
): ?Color {
  const hue = color.hue();
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

function getNearestColorByLightness(
  color: Color,
  palleteColors: Array<Color>,
): ?Color {
  const lightness = color.lightness();
  let delta = 1000;
  let result = null;
  for (var ii = 0, jj = palleteColors.length;  ii < jj; ii++) {
    const curr = palleteColors[ii];
    const currDelta = Math.abs(curr.lightness() - lightness);
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

function isColorGrey(color: Color): boolean {
  const rr = color.red();
  const gg = color.green();
  const bb = color.blue();
  return rr == gg && gg == bb;
}

function getNearestColor(
  color: Color,
  palleteColors: Array<Color>,
): ?Color {
  if (isColorGrey(color)) {
    return getNearestColorByLightness(color, palleteColors);
  } else {
    return getNearestColorByHue(color, palleteColors);
  }
}

export default getNearestColor;
