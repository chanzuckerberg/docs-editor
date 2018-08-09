// @flow

import invariant from 'invariant';

import type {DOMRect, DOMElement} from './Types';

function asElement(node: any): DOMElement {
  invariant(node && node.nodeType === 1, 'invalid element');
  const el: Element = node;
  return el;
}

export default asElement;
