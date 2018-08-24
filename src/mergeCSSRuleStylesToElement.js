// @flow

import camelize from './camelize';
import {CSS_SELECTOR_TEXT, CSS_SELECTOR_PRIORITY} from './getCSSRules';
import {OrderedMap} from 'immutable';

import type {DocumentLike} from './Types';
import type {CSSRules, StyleMap} from './getCSSRules';

export const CSS_VARIABLE_CHILD_LIST_ITEM_BEFORE_CONTENT =
  '--child-list-item-before-content';

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
      if (styleMap && (nodeName === 'ol' || nodeName === 'ul')) {
        let content = styleMap.get('content') || '';
        const children = content ? el.children : null;
        if (children) {
          // Remove the wrapping `""`.
          content = content.replace(/(^")|("$)/g, '');
          // Temporarity store the `content` as list-style-image.
          // We'll read it from `DocsCustomStyleMap.forListStyleImage()`
          // and `convertFromHTML()` later. Note that the fake url has to
          // look like a real url othewise browser will reject it.
          content = window.encodeURIComponent(content).replace(/\%/g, '-');
          content = `url(${content})`;
          for (let ii = 0, jj = children.length; ii < jj; ii++) {
            const item = children[ii];
            if (item.nodeName === 'LI') {
              item.style.listStyleImage = content;
            }
          }
        }
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

      const attr = styleName === CSS_VARIABLE_CHILD_LIST_ITEM_BEFORE_CONTENT ?
        styleName :
        camelize(styleName);
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
