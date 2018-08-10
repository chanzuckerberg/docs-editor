// @flow

import invariant from 'invariant';

// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
function getSafeBodyFromHTML(html: string): ?Element {
  let doc;
  let root = null;
  // Provides a safe context
  if (
    document.implementation &&
    document.implementation.createHTMLDocument
  ) {
    doc = document.implementation.createHTMLDocument('');
    invariant(doc.documentElement, 'Missing doc.documentElement');
    doc.documentElement.innerHTML = html;
    root = doc.getElementsByTagName('body')[0];
  }
  return root;
}

export default getSafeBodyFromHTML;
