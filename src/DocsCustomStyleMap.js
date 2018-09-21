// @flow

import Color from 'color';
import createPaletteColors from './createPaletteColors';
import createWebSafeColors from './createWebSafeColors';
import getNearestColor from './getNearestColor';
import hyphenize from './hyphenize';
import numberRange from './numberRange';

type StyleMapType = {
  [name: string]: {
    [attr: string]: string,
  };
};

// Styles that can be safely added as inline-style (e.g. style="color: red")
// to element directly.
const InlineStyles:  StyleMapType = {};

// Styles that should be linked a className that is added to the block element.
// via className which will be stored at `inlineStyleRanges` for a block.
const BlockStyles: StyleMapType = {};

const STYLES_SHEET_ID = 'DocsCustomStyleMap';
const STYLE_KEY_PREFIX = 'DOCS_STYLE';
const LIST_MAX_DEPTH = 20;
const WEB_SAFE_COLORS = createWebSafeColors();

// This files defined the supported Custom Styles.
// These styles will be used by `convertFromHTML()`.
// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52

// =============================================================================
// DO NOT RENAME THE KEY (e.g. "FONT_SIZE_KEY") because exiting saved document
// might have save these keys into `contentState => inlineStyleRanges`.
// =============================================================================

// http://www.color-hex.com/216-web-safe-colors/

// Background Color defaults to be brighter.
const BACKGROUND_COLOR_KEY = `${STYLE_KEY_PREFIX}_BACKGROUND_COLOR`;
const BACKGROUND_COLOR_VALUES = [Color('#4b4b96')].
  concat(WEB_SAFE_COLORS, createPaletteColors(90, 90)).
  filter(color => color.hex() !== '#FFFFFF');

const DEPTH_KEY = `${STYLE_KEY_PREFIX}_DEPTH`;
const DEPTH_VALUES = numberRange(1, 10);

const FONT_SIZE_KEY = `${STYLE_KEY_PREFIX}_FONT_SIZE`;
const FONT_SIZE_VALUES = numberRange(4, 86);

// Text Color defaults to be darker.
const COLOR_KEY = `${STYLE_KEY_PREFIX}_COLOR`;
const COLOR_VALUES = WEB_SAFE_COLORS.
  concat(createPaletteColors(90, 20)).
  filter(color => color.hex() !== '#000000');

const LINE_HEIGHT_KEY = `${STYLE_KEY_PREFIX}_LINE_HEIGHT`;
const LINE_HEIGHT_VALUES = numberRange(0.8, 3, 0.0);

const LIST_STYLE_TYPE_KEY = `${STYLE_KEY_PREFIX}_LIST_STYLE_TYPE`;
const LIST_STYLE_TYPE_VALUES = [
  'armenian',
  'circle',
  'cjk-ideographic',
  'decimal',
  'decimal-leading-zero',
  'disc',
  'georgian',
  'hebrew',
  'hiragana',
  'hiragana-iroha',
  'inherit',
  'katakana',
  'katakana-iroha',
  'lower-alpha',
  'lower-greek',
  'lower-latin',
  'lower-roman',
  'square',
  'upper-alpha',
  'upper-greek',
  'upper-latin',
  'upper-roman',
];

const LIST_START_KEY = `${STYLE_KEY_PREFIX}_LIST_START`;
const LIST_START_VALUES = numberRange(2, 100);

const TEXT_ALIGN_KEY = `${STYLE_KEY_PREFIX}_TEXT_ALIGN`;
const TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

const VERTICAL_ALIGN_KEY = `${STYLE_KEY_PREFIX}_VERTICAL_ALIGN`;
const VERTICAL_ALIGN_VALUES = [
  'baseline',
  'sub',
  'super',
  'text-bottom',
  'text-top',
];

const TRANSPARENT_COLORS = new Set([
  'default', 'transparent', 'rgba(0, 0, 0, 0)', 'inherit', 'none', 'initial',
  'rgba(255, 255, 255)', '#ffffff',
]);

function defineDepthStyle(
  styleMap: StyleMapType,
  depth: number,
): void {
  const suffix = String(depth);
  styleMap[`${DEPTH_KEY}_${suffix}`] = {
    'paddingLeft': `${depth * 24}pt`,
  };
}

function defineListStartStyle(
  styleMap: StyleMapType,
  listStart: number,
): void {
  const suffix = listStart.toString();
  styleMap[`${LIST_START_KEY}_${suffix}`] = {};
  let dd = 0;
  while (dd <= LIST_MAX_DEPTH) {
    styleMap[
      `${LIST_START_KEY}_${suffix}` +
      `.public-DraftStyleDefault-depth${dd}` +
      `.public-DraftStyleDefault-reset`
    ] = {
      'counter-reset': `ol${dd} ${listStart - 1}`,
    };
    dd++;
  }
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
  if (fontSize > 24) {
    styleMap[`${FONT_SIZE_KEY}_${suffix}PX`] = {
      'fontSize': `${fontSize}px`,
      'lineHeight': '1.2',
    };
    styleMap[`${FONT_SIZE_KEY}_${suffix}PT`] = {
      'fontSize': `${fontSize}pt`,
      'lineHeight': '1.2',
    };
  } else {
    styleMap[`${FONT_SIZE_KEY}_${suffix}PX`] = {
      'fontSize': `${fontSize}px`,
    };
    styleMap[`${FONT_SIZE_KEY}_${suffix}PT`] = {
      'fontSize': `${fontSize}pt`,
    };
  }
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
  styleMap[`${LIST_STYLE_TYPE_KEY}_${suffix}`] = {};
  let dd = 0;
  while (dd < LIST_MAX_DEPTH) {
    styleMap[
      `${LIST_STYLE_TYPE_KEY}_${suffix}` +
      `.public-DraftStyleDefault-orderedListItem` +
      `.public-DraftStyleDefault-depth${dd}::before`
    ] = {
      'content': `counter(ol${dd}, ${listStyleType}) ". "`,
    };
    dd++;
  }
}

function defineVerticalAlignStyle(
  styleMap: StyleMapType,
  align: string,
): void {
  const suffix = align.toUpperCase();
  styleMap[`${VERTICAL_ALIGN_KEY}_${suffix}`] = {
    'verticalAlign': `${align}`,
  };
}

function injectCSSIntoDocument(styleMap: StyleMapType): void {
  if (document.getElementById(STYLES_SHEET_ID)) {
    return;
  }
  const cssTexts = [];
  Object.keys(styleMap).sort().forEach(styleName => {
    if (InlineStyles[styleName]) {
      // If this style is meant to be applied inline, we don't need to map it to
      // a global className, except for the `<td />` element.
      // by <td />.
      cssTexts.push(`td.${styleName} {`);
    } else {
      cssTexts.push(`.${styleName} {`);
    }
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

  if (TRANSPARENT_COLORS.has(colorStr)) {
    return null;
  }
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
  colorStr: string,
): ?string {
  if (TRANSPARENT_COLORS.has(colorStr)) {
    return null;
  }
  const color = getNearestColor(
    Color(colorStr),
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
  const suffix = textAlign.toUpperCase();
  const key = `${TEXT_ALIGN_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

function forVerticalAlign(
  styleMap: StyleMapType,
  verticalAlign: string,
  ): ?string {
  const suffix = verticalAlign.toUpperCase();
  const key = `${VERTICAL_ALIGN_KEY}_${suffix}`;
  return styleMap[key] ? key : null;
}

function forDepth(
  styleMap: StyleMapType,
  depth: number,
): ?string {
  const suffix = String(depth);
  const key = `${DEPTH_KEY}_${suffix}`;
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

function forListStart(
  styleMap: StyleMapType,
  listStart: string,
): ?string {
  const suffix = listStart;
  const key = `${LIST_START_KEY}_${listStart}`;
  return styleMap[key] ? key : null;
}

BACKGROUND_COLOR_VALUES.forEach(defineBackgroundColorStyle.bind(null, InlineStyles));
COLOR_VALUES.forEach(defineColorStyle.bind(null, InlineStyles));
DEPTH_VALUES.forEach(defineDepthStyle.bind(null, BlockStyles));
FONT_SIZE_VALUES.forEach(defineFontSizeStyle.bind(null, InlineStyles));
LINE_HEIGHT_VALUES.forEach(defineLineHeightStyle.bind(null, BlockStyles));
LIST_START_VALUES.forEach(defineListStartStyle.bind(null, BlockStyles));
LIST_STYLE_TYPE_VALUES.forEach(defineListStyleTypeStyle.bind(null, BlockStyles));
TEXT_ALIGN_VALUES.forEach(defineTextAlignStyle.bind(null, BlockStyles));
VERTICAL_ALIGN_VALUES.forEach(defineVerticalAlignStyle.bind(null, InlineStyles));

const AllStyles = {...InlineStyles, ...BlockStyles};

const DocsCustomStyleMap = {
  // This will be passed to the prop `customStyleMap` at <DocsBaseEditor />.
  ...InlineStyles,
  LIST_STYLE_TYPE_VALUES,
  forBackgroundColor: forBackgroundColor.bind(null, InlineStyles),
  forColor: forColor.bind(null, AllStyles),
  forFontSize: forFontSize.bind(null, AllStyles),
  forLineHeight: forLineHeight.bind(null, AllStyles),
  forListStart: forListStart.bind(null, AllStyles),
  forListStyleType: forListStyleType.bind(null, AllStyles),
  forTextAlign: forTextAlign.bind(null, AllStyles),
  forVerticalAlign: forVerticalAlign.bind(null, AllStyles),
  forDepth: forDepth.bind(null, AllStyles),
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, AllStyles),
};

export default DocsCustomStyleMap;
