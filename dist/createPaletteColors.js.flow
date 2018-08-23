// @flow

import Color from 'color';

// https://krazydad.com/tutorials/makecolors.php
// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
// http://www.mattlag.com/colorchart/article.html
// https://www.w3schools.com/colors/colors_hsl.asp


function createPaletteColors(
  saturation: number, /* 0 ~ 100 */
  lightness: number, /* 0 ~ 100 */
): Array<Color> {
  const result = [];
  const ss = Math.min(100, Math.max(Math.round(saturation), 0));
  const ll = Math.min(100, Math.max(Math.round(lightness), 0));
  let hue = 0;
  while (hue <= 360) {
    const hsl = `hsl(${hue},${ss}%,${ll}%)`
    result.push(Color(hsl));
    hue += 20;
  }
  return result;
}

export default createPaletteColors;
