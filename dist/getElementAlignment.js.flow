// @flow

import type {ElementLike} from './Types';


const ALIGNMENT_VALUE_PATTERN = /left|center|right/i;

function getElementAlignment(
  el: ElementLike,
): ?string {
  const attributeValue = el.getAttribute('align');
  if (attributeValue && ALIGNMENT_VALUE_PATTERN.test(attributeValue)) {
    // For IMG, TD
    return attributeValue;
  }
  // TODO: Parse it from external stylesheet.
  return null;
}

export default getElementAlignment;
