// @flow

import ReactDOM from 'react-dom';

// TODO: Type Component properly.

function getComponentByElement(
  components: Set<Object>,
  element: any,
): ?Object {
  const elementToComponent = new Map();
  components.forEach((component: any) => {
    const node: any = ReactDOM.findDOMNode(component);
    if (node) {
      elementToComponent.set(node, component);
    }
  });

  while (element && element.nodeType === 1) {
    if (elementToComponent.has(element)) {
      return elementToComponent.get(element);
    }
    element = element.parentElement;
  }
  return null;
}

export default getComponentByElement;
