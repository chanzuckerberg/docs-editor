// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import asElement from './asElement';
import convertImageElementToPlaceholderElement from './convertImageElementToPlaceholderElement';
import getCSSRules from './getCSSRules';
import getSafeDocumentElementFromHTML from './getSafeDocumentElementFromHTML';
import uniqueID from './uniqueID';

import type {DocumentLike} from './Types';
import type {CSSRules} from './getCSSRules';

export type SafeHTML = {
  html: string,
  unsafeNodes: Map<string, Node>,
  cssRules: CSSRules,
};

const ZERO_WIDTH_CHAR = '\u200B';

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

    safeHTML = body.innerHTML;
  }

  return {
    cssRules,
    html: safeHTML,
    unsafeNodes,
  };
}

export default getSafeHTML;
