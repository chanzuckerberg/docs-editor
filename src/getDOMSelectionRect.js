// @flow

import type {DOMRect, DOMElement} from './Types';

function getDOMSelectionRect(): ?DOMRect  {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  const range: any = selection.getRangeAt(0);
  let rect = range ? range.getBoundingClientRect() : null;
  if (
    rect &&
    rect.width === 0 &&
    rect.height === 0 &&
    rect.x === 0 &&
    rect.y === 0 &&
    range &&
    range.commonAncestorContainer
  ) {
    // If the selection is collapsed, the rect will be empty.
    // use the element's rect where the cursor is at instead.
    rect = range.commonAncestorContainer.getBoundingClientRect();
  }
  return rect;
}

export default getDOMSelectionRect;
