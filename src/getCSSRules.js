// @flow

import type {DocumentLike, CSSStyleDeclarationLike} from './Types';

// e.g. '.my-class-name': {'color': 'red'}
export type CSSRules = Map<string, CSSStyleDeclarationLike>;

function getCSSRules(domDocument: ?DocumentLike): CSSRules {
  if (!domDocument) {
    return new Map();
  }

  const result = new Map();
  Array.from(domDocument.querySelectorAll('style')).forEach((el: any) => {
    const sheet = el.sheet;
    if (!sheet) {
      return;
    }
    const cssRules = sheet.cssRules;
    if (!cssRules) {
      return;
    }

    Array.from(cssRules).forEach(rule => {
      const selectorText = String(rule.selectorText || '');
      if (!selectorText) {
        // This could be `CSSImportRule.` created by @import().
        return;
      }
      const styleMap = rule.styleMap;
      if (!styleMap) {
        return;
      }
      const rules = result.get(selectorText) || {};
      rule.styleMap.forEach((cssStyleValue, key) => {
        // e.g. rules['color'] = 'red'.
        rules[String(key)] = String(cssStyleValue);
      });
      result.set(selectorText, rules);
    });
  });
  return result;
}

export default getCSSRules;
