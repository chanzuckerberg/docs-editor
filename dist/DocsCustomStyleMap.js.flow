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

// This files defined the supported Custom Styles.
// These styles will be used by `convertFromHTML()`.
// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52

// =============================================================================
// DO NOT RENAME THE KEY (e.g. "FONT_SIZE_KEY") because exiting saved document
// might have save these keys into `contentState => inlineStyleRanges`.
// =============================================================================

// Background Color defaults to be brighter.
const BACKGROUND_COLOR_KEY = `${STYLE_KEY_PREFIX}_BACKGROUND_COLOR`;
const BACKGROUND_COLOR_VALUES = [
  Color('#ffff00'),
  Color('#4b4b96'),
].concat(createPaletteColors(90, 90));

const FONT_SIZE_KEY = `${STYLE_KEY_PREFIX}_FONT_SIZE`;
const FONT_SIZE_VALUES = numberRange(4, 86);

// Text Color defaults to be darker.
const COLOR_KEY = `${STYLE_KEY_PREFIX}_COLOR`;
const COLOR_VALUES = [
  Color('#222222'),
  Color('#ffffff'),
].concat(createPaletteColors(90, 20));

const LINE_HEIGHT_KEY = `${STYLE_KEY_PREFIX}_LINE_HEIGHT`;
const LINE_HEIGHT_VALUES = numberRange(0.8, 5, 0.1);

const LIST_STYLE_IMAGE_KEY = `${STYLE_KEY_PREFIX}_LIST_STYLE_IMAGE`;
const LIST_STYLE_IMAGE_VALUES = ['25a0', '25cb', '25cd', '25cf'];

const LIST_STYLE_TYPE_KEY = `${STYLE_KEY_PREFIX}_LIST_STYLE_TYPE`;
const LIST_STYLE_TYPE_VALUES = ['none', 'disc'];

// We only support this cause google doc uses margin-left for indentation for
// <li />.
const MARGIN_LEFT_KEY = `${STYLE_KEY_PREFIX}_TEXT_ALIGN`;
const MARGIN_LEFT_VALUES = numberRange(12, 12 * 10, 12);

const TEXT_ALIGN_KEY = `${STYLE_KEY_PREFIX}_TEXT_ALIGN`;
const TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

function defineListStyleImage(
  styleMap: StyleMapType,
  listStyleImage: string,
): void {
  const suffix = listStyleImage.toUpperCase();
  const childSelector = '.public-DraftStyleDefault-block > span::before';

  // This className is just a placeholder, the actual style will be defined
  // at `...::before` below.
  styleMap[`${LIST_STYLE_IMAGE_KEY}_${suffix}`] = {};
  styleMap[`${LIST_STYLE_IMAGE_KEY}_${suffix} > ${childSelector}`] = {
    'content': '"\\00' + listStyleImage + '  "',
  };
}

function defineColorStyle(
  styleMap: StyleMapType,
  color: Color,
): void {
  // Get `#FFFFFF`.
  const hex = color.hex();
  const suffix = hex.substr(1);
  styleMap[`${COLOR_KEY}_${suffix}`] = {
    'color': hex,
  };
}


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
  styleMap[`${TEXT_ALIGN_KEY}_${suffix}`] = {
    'textAlign': `${align}`,
  };
}

function defineListStyleTypeStyle(
  styleMap: StyleMapType,
  listStyleType: string,
): void {
  const suffix = listStyleType.toUpperCase();
  styleMap[`${LIST_STYLE_TYPE_KEY}_${suffix}`] = {
    'listStyleType': `${listStyleType}`,
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

function forColor(
  styleMap: StyleMapType,
  colorStr: string,
): ?string {
  const color = getNearestColor(
    Color(colorStr),
    COLOR_VALUES,
  );
  const suffix = color ? color.hex().substr(1) : '';
  const key = `${COLOR_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

function forBackgroundColor(
  styleMap: StyleMapType,
  backgroundColor: string,
): ?string {
  const color = getNearestColor(
    Color(backgroundColor),
    BACKGROUND_COLOR_VALUES,
  );
  const suffix = color ? color.hex().substr(1) : ''
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

function forListStyleType(
  styleMap: StyleMapType,
  listStyleType: string,
): ?string {
  const suffix = String(listStyleType).toUpperCase();
  const key = `${LIST_STYLE_TYPE_KEY}_${suffix}`;
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

function forListStyleImage(
  styleMap: StyleMapType,
  listStyleImage: string,
): ?string {
  const url = listStyleImage.replace(/^url/, '').replace(/[\(\)\"\']/g, '')
  const content = window.decodeURIComponent(url.replace(/-/g, '%'));
  const suffix = content.charCodeAt(0).toString(16).toUpperCase();
  const key = `${LIST_STYLE_IMAGE_KEY}_${suffix}`;
  return styleMap[key] ? key : `DOCS_STYLE_LIST_STYLE_IMAGE_25CB`;
}

// Styles that can be safely added as inline-style (e.g. style="color: red")
// to element directly.
const InlineStyles = {};

// Styles that should be linked a className that is added to the block element.
// via className which will be stored at `inlineStyleRanges` for a block.
const BlockStyles = {};

BACKGROUND_COLOR_VALUES.forEach(defineBackgroundColorStyle.bind(null, InlineStyles));
COLOR_VALUES.forEach(defineColorStyle.bind(null, InlineStyles));
FONT_SIZE_VALUES.forEach(defineFontSizeStyle.bind(null, InlineStyles));
LINE_HEIGHT_VALUES.forEach(defineLineHeightStyle.bind(null, BlockStyles));
LIST_STYLE_IMAGE_VALUES.forEach(defineListStyleImage.bind(null, BlockStyles));
LIST_STYLE_TYPE_VALUES.forEach(defineListStyleTypeStyle.bind(null, BlockStyles));
MARGIN_LEFT_VALUES.forEach(defineMarginLeftStyle.bind(null, BlockStyles));
TEXT_ALIGN_VALUES.forEach(defineTextAlignStyle.bind(null, BlockStyles));

const AllStyles = {...InlineStyles, ...BlockStyles};

const DocsCustomStyleMap = {
  // This will be passed to the prop `customStyleMap` at <DocsBaseEditor />.
  ...InlineStyles,
  forColor: forColor.bind(null, AllStyles),
  forBackgroundColor: forBackgroundColor.bind(null, AllStyles),
  forFontSize: forFontSize.bind(null, AllStyles),
  forLineHeight: forLineHeight.bind(null, AllStyles),
  forListStyleImage: forListStyleImage.bind(null, AllStyles),
  forListStyleType: forListStyleType.bind(null, AllStyles),
  forMarginLeft: forMarginLeft.bind(null, AllStyles),
  forTextAlign: forTextAlign.bind(null, AllStyles),
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, AllStyles),
};

export default DocsCustomStyleMap;
