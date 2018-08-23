// @flow

import createPaletteColors from './createPaletteColors';
import decamelize from 'decamelize';
import numberRange from './numberRange';

type StyleMapType = {
  [name: string]: {
    [attr: string]: string,
  };
};

const STYLES_SHEET_ID = 'DocsCustomStyleMap';
const StyleMap: StyleMapType = {};

function defineFontSizeStyle(
  styleMap: StyleMapType,
  fontSize: number,
): void {
  styleMap[`FONT_SIZE_${fontSize}px`] = {
    'fontSize': `${fontSize}px`,
  };
  styleMap[`FONT_SIZE_${fontSize}pt`] = {
    'fontSize': `${fontSize}pt`,
  };
}

function defineLineHeightStyle(
  styleMap: StyleMapType,
  lineHeight: number,
): void {
  styleMap[`LINE_HEIGHT_${lineHeight}`] = {
    'lineHeight': `${lineHeight}`,
  };
}

function defineTextAlignStyle(
  styleMap: StyleMapType,
  align: string,
): void {
  styleMap[`TEXT_ALIGN_${align}`] = {
    'textAlign': `${align}`,
  };
}

function injectCSSIntoDocument(styleMap: StyleMapType): void {
  if (document.getElementById(STYLES_SHEET_ID)) {
    return;
  }
  const cssTexts = [];
  Object.keys(styleMap).forEach(styleName => {
    cssTexts.push(`.${styleName} {`);
    const rules = styleMap[styleName];
    Object.keys(rules).forEach(attr => {
       cssTexts.push(`${decamelize(attr, '-')}: ${rules[attr]};`);
    });
    cssTexts.push('}');
  });

  const el = document.createElement('style');
  el.id = STYLES_SHEET_ID;
  el.appendChild(document.createTextNode(cssTexts.join('\n')));
  const root = document.head || document.body;
  root && root.appendChild(el);
}

numberRange(6, 86).forEach(defineFontSizeStyle.bind(null, StyleMap));
numberRange(0.8, 5, 0.1).forEach(defineLineHeightStyle.bind(null, StyleMap));
['left', 'center', 'right'].forEach(defineTextAlignStyle.bind(null, StyleMap));

const DocsCustomStyleMap = {
  ...StyleMap,
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, StyleMap),
};

// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52
export default DocsCustomStyleMap;
