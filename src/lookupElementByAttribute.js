// @flow

import type {ElementLike} from './Types';

function lookupElementByAttribute(
  element: ElementLike | Element,
  attr: string,
  value: ?string,
): ?ElementLike {
  let node: any = element;
  while (node) {
    if (node && node.nodeType === 1) {
      if (attr === 'class' || attr === 'className') {
        const {classList} = node;
        if (classList && value && classList.contains(value)) {
          return node;
        }
        if (classList && value === undefined && classList.length > 0) {
          return node;
        }
        if (!classList) {
          // TODO: Fallback?
          return null;
        }
      }
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
