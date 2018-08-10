// @flow

import invariant from 'invariant';

import type {ClientRectLike, ElementLike} from './Types';

function asElement(node: any): ElementLike {
  invariant(node && node.nodeType === 1, 'invalid element');
  const el: ElementLike = node;
  return el;
}

export default asElement;
