// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import asElement from './asElement';
import getElementAlignment from './getElementAlignment';
import getElementDimension from './getElementDimension';

import type {DocsImageEntityData} from './Types';

const ZERO_WIDTH_CHAR = '\u200B';

// Note that this function has side-effect!
// img does not have characters data, thus DraftJS wo't be able to
// parse its entity data. The workaround is to replace it with an
// empty element that can be converted to DocsImage later.
function convertImageElementToPlaceholderElement(img: Object): void {
  const {parentNode, src} = img;
  if (!parentNode || !src) {
    return;
  }

  const imgEl = asElement(img);

  if (imgEl.getAttribute(DocsDataAttributes.ELEMENT)) {
    // The image is rendered by <DocsSafeImage /> which contains its meta
    // data at its containing <span /> element. We can skip this <img />
    // element.
    parentNode.removeChild(img);
    return;
  }

  const doc = img.ownerDocument;
  const node = doc.createElement('ins');

  const entityData: DocsImageEntityData = {
    url: src,
    align: getElementAlignment(imgEl),
    height: getElementDimension(imgEl, 'height'),
    width: getElementDimension(imgEl, 'width'),
  };

  const decoratorData = {
    type: DocsDecoratorTypes.DOCS_IMAGE,
    mutability: 'IMMUTABLE',
    data: entityData,
  };

  node.setAttribute(
    DocsDataAttributes.DECORATOR_DATA,
    JSON.stringify(decoratorData),
  );
  node.setAttribute(
    DocsDataAttributes.DECORATOR_TYPE,
    DocsDecoratorTypes.DOCS_IMAGE,
  );
  node.innerHTML = ZERO_WIDTH_CHAR;
  parentNode.insertBefore(node, img);
  parentNode.removeChild(img);
}

export default convertImageElementToPlaceholderElement;
