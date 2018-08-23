// @flow

import Color from 'color';
import createPaletteColors from './createPaletteColors';
import getNearestColor from './getNearestColor';
import hyphenize from './hyphenize';
import numberRange from './numberRange';

type StyleMapType = {
  [name: string]: {
    [attr: string]: string,
  };
};

const STYLES_SHEET_ID = 'DocsCustomStyleMap';
const STYLE_KEY_PREFIX = 'DOCS_STYLE';

// Supported Custom Styles.
// These styles will be used at `convertFromHTML()`.
const BACKGROUND_COLOR_KEY = `${STYLE_KEY_PREFIX}_BACKGROUND_COLOR`;
const BACKGROUND_COLOR_VALUES = [Color('#ffff00')].concat(createPaletteColors(90, 90));

const FONT_SIZE_KEY = `${STYLE_KEY_PREFIX}_FONT_SIZE`;
const FONT_SIZE_VALUES = numberRange(4, 86);

const LINE_HEIGHT_KEY = `${STYLE_KEY_PREFIX}_LINE_HEIGHT`;
const LINE_HEIGHT_VALUES = numberRange(0.8, 5, 0.1);

// We support this cause google doc uses margin-left for indentation for <li />.
const MARGIN_LEFT_KEY = `${STYLE_KEY_PREFIX}_TEXT_ALIGN`;
const MARGIN_LEFT_VALUES = numberRange(12, 12 * 10, 12);

const TEXT_ALIGN_KEY = `${STYLE_KEY_PREFIX}_TEXT_ALIGN`;
const TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

const StyleMap: StyleMapType = {};

function defineBackgroundColorStyle(
  styleMap: StyleMapType,
  color: Color,
): void {
  // Get `#FFFFFF`.
  const hex = color.hex();
  const suffix = hex.substr(1);
  styleMap[`${BACKGROUND_COLOR_KEY}_${suffix}`] = {
    'backgroundColor': hex,
  };
}

function defineFontSizeStyle(
  styleMap: StyleMapType,
  fontSize: number,
): void {
  // 1.5px => 1-5PT.
  const suffix = String(fontSize).replace(/[\.]/, '-');
  styleMap[`${FONT_SIZE_KEY}_${suffix}PX`] = {
    'fontSize': `${fontSize}px`,
  };
  styleMap[`${FONT_SIZE_KEY}_${suffix}PT`] = {
    'fontSize': `${fontSize}pt`,
  };
}

function defineLineHeightStyle(
  styleMap: StyleMapType,
  lineHeight: number,
): void {
  const suffix = String(lineHeight).replace(/[\.]/, '-');
  styleMap[`${LINE_HEIGHT_KEY}_${suffix}`] = {
    'lineHeight': `${lineHeight}`,
  };
}

function defineMarginLeftStyle(
  styleMap: StyleMapType,
  marginLeft: number,
): void {
  const suffix = String(marginLeft);
  styleMap[`${MARGIN_LEFT_KEY}_${suffix}PT`] = {
    'marginLeft': `${marginLeft}pt`,
  };
}

function defineTextAlignStyle(
  styleMap: StyleMapType,
  align: string,
): void {
  const suffix = align.toUpperCase();
  styleMap[`TEXT_ALIGN_${suffix}`] = {
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
       cssTexts.push(`${hyphenize(attr)}: ${rules[attr]} !important;`);
    });
    cssTexts.push('}');
  });

  const el = document.createElement('style');
  el.id = STYLES_SHEET_ID;
  el.appendChild(document.createTextNode(cssTexts.join('\n')));
  const root = document.head || document.body;
  root && root.appendChild(el);
}

function forBackgroundColor(
  styleMap: StyleMapType,
  backgroundColor: string,
): ?string {
  const color = Color(backgroundColor);
  const suffix = color.hex().substr(1);
  const key = `${BACKGROUND_COLOR_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

function forFontSize(
  styleMap: StyleMapType,
  fontSize: string,
): ?string {
  // 12.5pt => 12-5PT
  const suffix = String(fontSize).replace(/[\.]/, '-').toUpperCase();
  const key = `${FONT_SIZE_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

function forTextAlign(
  styleMap: StyleMapType,
  textAlign: string,
): ?string {
  const suffix = textAlign.substr(1);
  const key = `${TEXT_ALIGN_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

function forLineHeight(
  styleMap: StyleMapType,
  lineHeight: string,
): ?string {
  const suffix = String(lineHeight).replace(/[\.]/, '-');
  const key = `${LINE_HEIGHT_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

function forMarginLeft(
  styleMap: StyleMapType,
  marginLeft: string,
): ?string {
  const suffix = String(marginLeft).toUpperCase();
  const key = `${MARGIN_LEFT_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

BACKGROUND_COLOR_VALUES.forEach(defineBackgroundColorStyle.bind(null, StyleMap));
FONT_SIZE_VALUES.forEach(defineFontSizeStyle.bind(null, StyleMap));
LINE_HEIGHT_VALUES.forEach(defineLineHeightStyle.bind(null, StyleMap));
MARGIN_LEFT_VALUES.forEach(defineMarginLeftStyle.bind(null, StyleMap));
TEXT_ALIGN_VALUES.forEach(defineTextAlignStyle.bind(null, StyleMap));

const DocsCustomStyleMap = {
  ...StyleMap,
  forBackgroundColor: forBackgroundColor.bind(null, StyleMap),
  forFontSize: forFontSize.bind(null, StyleMap),
  forLineHeight: forLineHeight.bind(null, StyleMap),
  forMarginLeft: forMarginLeft.bind(null, StyleMap),
  forTextAlign: forTextAlign.bind(null, StyleMap),
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, StyleMap),
};

// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52
export default DocsCustomStyleMap;