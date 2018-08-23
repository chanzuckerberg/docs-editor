// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import asElement from './asElement';
import camelCase from 'camelcase';
import convertImageElementToPlaceholderElement from './convertImageElementToPlaceholderElement';
import getCSSRules from './getCSSRules';
import getSafeDocumentElementFromHTML from './getSafeDocumentElementFromHTML';
import uniqueID from './uniqueID';
import {CSS_SELECTOR_TEXT, CSS_SELECTOR_PRIORITY} from './getCSSRules';

import type {DocumentLike} from './Types';
import type {CSSRules} from './getCSSRules';

export type SafeHTML = {
  html: string,
  unsafeNodes: Map<string, Node>,
  cssRules: CSSRules,
};

const ZERO_WIDTH_CHAR = '\u200B';

function mergeInlineStylesToElement(cssRules: CSSRules, el: any): void {
  const {classList, style} = el;
  if (!style || !classList || !classList.length) {
    // `el.style` could be `null` if `el` is `<math />`.
    return;
  }
  // We need to sort the linked styles based on their orders in CSSRules,
  // So later rules can overwrite previous one.
  const sortKey = CSS_SELECTOR_PRIORITY;
  const styleMaps = Array
    .from(classList)
    .map(className => {
      const selector = `.${className}`;
      return cssRules.get(selector);
    })
    .filter(Boolean)
    .sort((a, b) => {
      return a.get(sortKey) >= b.get(sortKey) ? 1 : -1;
    });


  let styleNew = null;
  styleMaps.forEach(styleMap => {
    styleMap.forEach((styleValue, styleName) => {
      if (
        styleName === CSS_SELECTOR_TEXT ||
        styleName === CSS_SELECTOR_PRIORITY
      ) {
        return;
      }
      const attr = camelCase(styleName);
      if (style[attr]) {
        // Already has inline-style.
        return;
      }
      styleNew = styleNew || {};
      styleNew[attr] = styleValue;
    });
  });

  styleNew && Object.assign(style, styleNew);
}

function getSafeHTML(
  html: string,
  domDocument?: ?DocumentLike,
): SafeHTML {
  const documentElement = getSafeDocumentElementFromHTML(html, domDocument);
  const body = documentElement ? documentElement.querySelector('body') : null;
  const ownerDocument: any = body && body.ownerDocument;
  const cssRules = getCSSRules(ownerDocument);
  const unsafeNodes = new Map();
  let safeHTML = '';
  if (body) {
    // The provided chidlren nodes inside the atomic block should never be
    // rendered. Instead, the atomic block should only render with its entity
    // data. Therefore, move the children nodes into the quarantine pool
    // otherwise these chidlren wil be rendered as extra block after the atomic
    // block.
    const quarantine = (node) => {
      const id = uniqueID();
      node.id = id;
      unsafeNodes.set(id, node.cloneNode(true));
      node.innerHTML = ZERO_WIDTH_CHAR;
    };

    const atomicNodes = body.querySelectorAll(
      'figure[' + DocsDataAttributes.ATOMIC_BLOCK_DATA + ']',
    );
    Array.from(atomicNodes).forEach(quarantine);

    const tableNodes = body.querySelectorAll('table');
    Array.from(tableNodes).forEach(quarantine);

    const mathNodes = body.querySelectorAll(
      'span[' +
      DocsDataAttributes.DECORATOR_TYPE + '="' +
      DocsDecoratorTypes.DOCS_MATH +
      '"]',
    );
    Array.from(mathNodes).forEach(quarantine);

    const imgNodes =  body.querySelectorAll('img');
    Array.from(imgNodes).forEach(convertImageElementToPlaceholderElement);

    // Apply all linked CSS styles to element.
    Array.
      from(body.querySelectorAll('[class]')).
      forEach(mergeInlineStylesToElement.bind(null, cssRules));


    safeHTML = body.innerHTML;
  }

  return {
    cssRules,
    html: safeHTML,
    unsafeNodes,
  };
}



export default getSafeHTML;
