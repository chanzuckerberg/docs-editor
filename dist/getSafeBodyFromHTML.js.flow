// @flow

import invariant from 'invariant';

import type {DocsTableEntityData,  DocumentLike, ElementLike} from './Types';

// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
function getSafeBodyFromHTML(
  html: string,
  domDocument?: ?DocumentLike,
): ?Element {
  let root = null;

  if (/<body[\s>]/i.test(html) === false) {
    html = `<!doctype><html><body>${html}</body></html>`;
  }

  // Provides a safe context
  if (domDocument) {
    domDocument.open();
    domDocument.write(html);
    domDocument.close();
    root = domDocument.getElementsByTagName('body')[0];
  } else if (
    typeof document !== 'undefined' &&
    document.implementation &&
    document.implementation.createHTMLDocument
  ) {
    const doc = document.implementation.createHTMLDocument('');
    doc.open();
    doc.write(html);
    doc.close();
    root = doc.getElementsByTagName('body')[0];
  }
  return root;
}

export default getSafeBodyFromHTML;
