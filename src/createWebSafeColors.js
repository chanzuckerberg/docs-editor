// @flow

import Color from 'color';

function createWebSafeColors(): Array<Color> {
  const result = [];
  for (let r = 0; r < 16; r += 1) {
    const rh = r.toString(16);
    for (let g = 0; g < 16; g += 1) {
      const gh = g.toString(16);
      for (let b = 0; b < 16; b += 1) {
        const bh = b.toString(16);
        const hex = '#' + rh + gh + bh;
        result.push(Color(hex));
      }
    }
  }
  return result;
}

export default createWebSafeColors;
