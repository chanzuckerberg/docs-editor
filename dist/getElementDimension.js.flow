// @flow

import type {ElementLike} from './Types';

type Dimension = 'width' | 'height';

function getElementDimension(
  el: ElementLike,
  dimension: Dimension,
): ?number {
  const attributeValue = el.getAttribute(dimension);
  if (attributeValue && /\d+/.test(attributeValue)) {
    return parseInt(attributeValue, 10);
  }
  const styleValue = el.style[dimension];
  if (styleValue && /\d+px/.test(styleValue)) {
    return parseFloat(styleValue);
  }
  // TODO: Parse it from external stylesheet.
  return null;
}

export default getElementDimension;
