// @flow

import Color from 'color';
import React from 'react';
import createPaletteColors from './createPaletteColors';
import getNearestColor from './getNearestColor';
import numberRange from './numberRange';
import {OrderedMap} from 'immutable';

const CLASS_NAME_PREFIX = 'DocsCustomStyleSheet_';
const CLASS_NAME_PREFIX_PATTERN = /^DocsCustomStyleSheet_/;

const BACKGROUND_COLOR = 'background-color';
const BACKGROUND_COLOR_VALUES = createPaletteColors(90, 90);

const FONT_SIZE = 'font-size';
const FONT_SIZE_VALUES = numberRange(4, 80, 1).map(n => n + 'pt');

const LINE_HEIGHT = 'line-height';
const LINE_HEIGHT_VALUES = numberRange(1.10, 3, 0.05).map(n => String(n));

const TEXT_ALIGN = 'text-align';
const TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

const SUPPORTED_STYLES = {
  [BACKGROUND_COLOR]: new Set(BACKGROUND_COLOR_VALUES.map(c => c.hsl().string())),
  [FONT_SIZE]: new Set(FONT_SIZE_VALUES),
  [LINE_HEIGHT]: new Set(LINE_HEIGHT_VALUES),
  [TEXT_ALIGN]: new Set(TEXT_ALIGN_VALUES),
};

const STYLE_ELEMENT_ID = 'DocsCustomStyleSheet_';

function buildClassName(styleName: string, styleValue: string): string {
  // Invalid characters will be replaced with `_`.
  const suffix = styleValue.replace(/[^a-zA-Z_0-9-]/g, '_-');
  return `${CLASS_NAME_PREFIX}-${styleName}-${suffix}`;
}

function buildCSSText(styleName: string, styleValue: string): string {
  const className = buildClassName(styleName, styleValue);
  return `.${className}.${className} {${styleName}: ${styleValue} ;}`;
}

function getCSSTexts(): string {
  const cssTexts = [];
  Object.keys(SUPPORTED_STYLES).forEach(styleName => {
    const styleValues = SUPPORTED_STYLES[styleName];
    styleValues.forEach(styleValue => {
      cssTexts.push(buildCSSText(styleName, styleValue));
    });
  });
  return cssTexts.join('\n');
}

function getClassNameForStyle(styleName: string, styleValue: string): ?string {
  const styleValues = SUPPORTED_STYLES[styleName];
  if (!styleValues) {
    return null;
  }

  if (styleName === BACKGROUND_COLOR) {
    const color = getNearestColor(
      Color(styleValue),
      BACKGROUND_COLOR_VALUES,
      styleValue,
    );
    if (color) {
      return buildClassName(styleName, color.hsl().string());
    }
  }

  if (styleValues.has(styleValue)) {
    return buildClassName(styleName, styleValue);
  }

  return null;
}

function isClassNameSupported(className: string): boolean {
  return CLASS_NAME_PREFIX_PATTERN.test(className);
}

class DocsCustomStyleSheet extends React.PureComponent {

  static BACKGROUND_COLOR = BACKGROUND_COLOR;

  static getClassNameForStyle = getClassNameForStyle;

  static isClassNameSupported = isClassNameSupported;

  componentWillMount(): void {
    const id = STYLE_ELEMENT_ID;
    const el = document.getElementById(id) || document.createElement('style');
    if (el.parentElement) {
      return;
    }
    el.id = id;
    el.appendChild(document.createTextNode(getCSSTexts()));
    const parent = document.head || document.body;
    parent && parent.appendChild(el);
  }

  render(): ?React.Element<any> {
    return null;
  }
}

export default DocsCustomStyleSheet;
