// @flow

import DocsDataAttributes from './DocsDataAttributes';
import asElement from './asElement';
import lookupElementByAttribute from './lookupElementByAttribute';

import type {ElementLike} from './Types';

function lookupResizeableTableCellElement(
  el: Element | ElementLike,
): ?ElementLike {
  const table = lookupElementByAttribute(
    el,
    DocsDataAttributes.TABLE,
  );
  if (!table) {
    return null;
  }
  const {tBodies} = table;
  if (!tBodies) {
    return null;
  }
  const body = tBodies[0];
  if (!body) {
    return null;
  }
  const selector = '.docs-table-resize-placeholder-cell';
  const resizeCells = Array.from(body.querySelectorAll(selector));
  const {left, right} = el.getBoundingClientRect();
  return resizeCells.find(cell => {
    const cellRect = asElement(cell).getBoundingClientRect();
    if (left >= cellRect.left && right <= cellRect.right) {
      return cell;
    }
  });
}

export default lookupResizeableTableCellElement;
