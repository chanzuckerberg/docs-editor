// @flow

import {OrderedMap} from 'immutable';

import type {DocumentLike} from './Types';

// e.g. {'text-align': 'center'}
export type StyleMap = OrderedMap<string, string>;

// e.g. '.my-class-name': {'color': 'red'}
export type CSSRules = OrderedMap<string, StyleMap>;

export const CSS_SELECTOR_PRIORITY = '--docs-css-selector-priority';
export const CSS_SELECTOR_TEXT = '--docs-css-selector-text';

const EMPTY_MAP = new OrderedMap();

function getCSSRules(domDocument: ?DocumentLike): CSSRules {
  const cssRules = EMPTY_MAP.withMutations((mutableCSSRules) => {
    if (!domDocument) {
      return;
    }
    Array.from(domDocument.querySelectorAll('style')).forEach((el: any) => {
      const sheet = el.sheet;
      if (!sheet) {
        // TODO: Find out why the browser does not support this.
        return;
      }

      const cssRules = sheet.cssRules;
      if (!cssRules) {
        // TODO: Find out why the browser does not support this.
        return;
      }

      Array.from(cssRules).forEach((rule, cssRuleIndex) => {
        const selectorText = String(rule.selectorText || '');
        if (!selectorText) {
          // This could be `CSSImportRule.` created by @import().
          return;
        }

        if (!rule.styleMap) {
          // TODO: Find out why the browser does not support this.
          return;
        }

        let styleMap = mutableCSSRules.get(selectorText) || EMPTY_MAP;
        styleMap = styleMap.withMutations(nextStyleMap => {
          rule.styleMap.forEach((cssStyleValue, key) => {
            // e.g. rules['color'] = 'red'.
            nextStyleMap.set(String(key), String(cssStyleValue));
          });
          // We need to remember the order of css selector so we could compare
          // its priority later.
          nextStyleMap.set(CSS_SELECTOR_PRIORITY, cssRuleIndex);
          nextStyleMap.set(CSS_SELECTOR_TEXT, selectorText);
        });
        if (styleMap.size > 0) {
          mutableCSSRules.set(selectorText, styleMap);
        }
      });
    });
  });
  return cssRules;
}

export default getCSSRules;
