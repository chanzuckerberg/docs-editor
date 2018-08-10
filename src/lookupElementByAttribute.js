// @flow

import type {ElementLike} from './Types';

function lookupElementByAttribute(
  element: ElementLike,
  attr: string,
  value: ?string,
): ?ElementLike {
  let node: any = element;
  while (node) {
    if (node && node.nodeType === 1) {
      if (value === undefined && node.hasAttribute(attr)) {
        return node;
      } else if (node.getAttribute(attr) === value) {
        return node;
      }
    }
    node = node.parentElement;
  }
  return null;
}

export default lookupElementByAttribute;
