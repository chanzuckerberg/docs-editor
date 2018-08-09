// @flow

function lookupElementByAttribute(
  element: ?Element,
  attr: string,
  value: ?string,
): ?Element {
  let node: any = element;
  while (node) {
    if (node && node.nodeType === 1) {
      if (value === undefined && node.hasAttribute(attr)) {
        return node;
      } else if (node.getAttribute(attr) === value) {
        return node;
      }
    }
    node = node.parentNode;
  }
  return null;
}

export default lookupElementByAttribute;
