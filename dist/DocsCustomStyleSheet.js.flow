// @flow

import React from 'react';
import Color from 'color';
import numberRange from './numberRange';
import {OrderedMap} from 'immutable';

const CLASS_NAME_PREFIX = 'DocsCustomStyleSheet';

const BACKGROUND_COLOR = 'background-color';
const BACKGROUND_COLOR_VALUES = ['#FCE5CD'];

const FONT_SIZE = 'font-size';
const FONT_SIZE_VALUES = numberRange(16, 80).map(n => n + 'pt');

const LINE_HEIGHT = 'line-height';
const LINE_HEIGHT_VALUES = numberRange(1.10, 3, 0.05).map(n => String(n));

const TEXT_ALIGN = 'text-align';
const TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
const SUPPORTED_STYLES = {
  [BACKGROUND_COLOR]: new Set(BACKGROUND_COLOR_VALUES),
  [FONT_SIZE]: new Set(FONT_SIZE_VALUES),
  [LINE_HEIGHT]: new Set(LINE_HEIGHT_VALUES),
  [TEXT_ALIGN]: new Set(TEXT_ALIGN_VALUES),
};

function escapeCSSChars(className: string): string {
  return className.replace(/[^a-zA-Z_0-9-]/g, '_-');
  // return className.replace(/[^a-zA-Z_0-9-]/g, '\\$&');
}

function buildClassName(styleName: string, styleValue: string): string {
  const suffix = escapeCSSChars(styleValue);
  return `${CLASS_NAME_PREFIX}-${styleName}-${suffix}`;
}

function getClassName(styleName: string, styleValue: string): ?string {
  const styleValues = SUPPORTED_STYLES[styleName];
  if (!styleValues) {
    return null;
  }

  if (styleName === BACKGROUND_COLOR) {
    styleValue = Color(styleValue).hex();
  }

  if (styleValues.has(styleValue)) {
    return buildClassName(styleName, styleValue);
  }

  return null;
}

function getCSSTexts(): string {
  const cssTexts = [];
  Object.keys(SUPPORTED_STYLES).forEach(styleName => {
    const styleValues = SUPPORTED_STYLES[styleName];
    styleValues.forEach(styleValue => {
      const suffix = escapeCSSChars(styleValue);
      const className = buildClassName(styleName, styleValue);
      cssTexts.push(`.${className} {${styleName}: ${styleValue};}`);
    });
  });
  return cssTexts.join('\n');
}

class DocsCustomStyleSheet extends React.PureComponent {

  static BACKGROUND_COLOR = BACKGROUND_COLOR;
  static getClassName = getClassName;

  componentWillMount(): void {
    const id = 'DocsCustomStyleSheet';
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
