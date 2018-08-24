// @flow

import Color from 'color';

// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// https://stackoverflow.com/questions/19782975/convert-rgb-color-to-the-nearest-color-in-palette-web-safe-color
// TODO: Use binary search when palleteColors is sorted.

const COLOR_BUFFER = 20;

function getNearestColor(
  color: Color,
  palleteColors: Array<Color>,
): ?Color {
  const hue = color.hue();
  const lightness = color.lightness();
  const saturationv = color.saturationv();

  const colorStr = color.string();
  let hueDelta = 1000;
  let lightnessDelta = 1000;
  let saturationvDelta = 1000;
  let result = null;
  for (var ii = 0, jj = palleteColors.length;  ii < jj; ii++) {
    const curr = palleteColors[ii];
    const hd = Math.abs(curr.hue() - hue);
    const ld = Math.abs(curr.lightness() - lightness);
    const sd = Math.abs(curr.saturationv () - saturationv);
    if (
      hd <= COLOR_BUFFER &&
      ld <= COLOR_BUFFER &&
      sd <= COLOR_BUFFER &&
      hd <= hueDelta &&
      ld  <= lightnessDelta &&
      sd <= saturationvDelta
    ) {
      hueDelta = hd;
      lightnessDelta = ld;
      saturationvDelta = sd;
      result = curr;
    }

    if (hd === 0 && ld === 0 && sd === 0) {
      // Match exactly
      return curr;
    }
  }
  return result;
}

export default getNearestColor;
