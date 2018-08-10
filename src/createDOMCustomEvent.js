// @flow

// Core helper function.
// Do not require any Component or Modifier in this file to avoid circular
// dependiencies.

const {CustomEvent} = window;

function createDOMCustomEvent(
  type: string,
  bubbles: boolean,
  cancelable: boolean,
  detail: any,
): Event {
  if (detail === undefined) {
    detail = null;
  }
  return new CustomEvent(type, {bubbles, cancelable, detail});
}

export default createDOMCustomEvent;
