// @flow

import camelize from './camelize';
import {CSS_SELECTOR_TEXT, CSS_SELECTOR_PRIORITY, LIST_STYLE_TYPES} from './getCSSRules';
import {OrderedMap} from 'immutable';

import type {DocumentLike} from './Types';
import type {CSSRules, StyleMap} from './getCSSRules';

const CHAR_BULLET = '\u25CF';
const CHAR_CIRCLE = '\u25cb';

function sortCSSRuleStyleMap(
  one: StyleMap,
  two: StyleMap,
): number {
  const p1 = one.get(CSS_SELECTOR_PRIORITY);
  const p2 = two.get(CSS_SELECTOR_PRIORITY);
  return p1 >= p2 ? 1 : -1;
}

function mergeCSSRuleStylesToElement(cssRules: CSSRules, el: HTMLElement): void {
  const {classList, style} = el;
  if (!style || !classList || !classList.length) {
    // `el.style` could be `null` if `el` is `<math />`.
    return;
  }
  // We need to sort the linked styles based on their orders in CSSRules,
  // So later rules can overwrite previous one.
  const elStyle: Object = style;
  const nodeName = el.nodeName.toLowerCase();

  const sortedStyleMaps = Array
    .from(classList)
    .reduce((memo, className) => {
      // Try `.class-name`
      let styleMap = cssRules.get(`.${className}`);
      if (styleMap) {
        memo.push(styleMap);
      }
      // Try `ul.class-name`
      styleMap = cssRules.get(`${nodeName}.${className}`);
      if (styleMap) {
        memo.push(styleMap);
      }

      // Try `.class-name > li::before`
      // This handles the special case that google docs uses `content: "."`
      // as the bullet for the list item.
      styleMap = cssRules.get(`.${className} > li::before`);

      let listStyleType;
      if (styleMap) {
        const content = String(styleMap.get('content') );
        if (!content) {
          // pass
        } else if (content.indexOf(CHAR_CIRCLE) >= 0) {
          listStyleType = 'circle';
        } else if (content.indexOf(CHAR_BULLET) >= 0) {
          listStyleType = 'disc';
        } else {
          const found = LIST_STYLE_TYPES.find(t => content.indexOf(t) >= 0);
          if (found) {
            listStyleType = found;
          }
        }
      }

      if (listStyleType) {
        // $FlowFixMe
        memo.push(OrderedMap({'list-style-type': listStyleType}));
      }

      return memo;
    }, [])
    .sort(sortCSSRuleStyleMap);

  let styleNew = null;
  sortedStyleMaps.forEach(styleMap => {
    styleMap.forEach((styleValue, styleName) => {
      if (
        styleName === CSS_SELECTOR_TEXT ||
        styleName === CSS_SELECTOR_PRIORITY
      ) {
        return;
      }

      if (styleName === 'background-color' && nodeName !== 'span') {
        return;
      }

      const attr = camelize(styleName);
      if (elStyle[attr]) {
        // Already has inline-style.
        return;
      }
      styleNew = styleNew || {};
      styleNew[attr] = styleValue;
    });
  });

  styleNew && Object.assign(style, styleNew);
}

export default mergeCSSRuleStylesToElement;
