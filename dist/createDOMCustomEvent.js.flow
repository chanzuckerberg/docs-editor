// @flow

// Core helper function.
// Do not require any Component or Modifier in this file to avoid circular
// dependiencies.

function createDOMCustomEvent(
  type: string,
  bubbles: boolean,
  cancelable: boolean,
  detail: any,
): Event {
  if (detail === undefined) {
    detail = null;
  }
  return new window.CustomEvent(type, {bubbles, cancelable, detail});
}

export default createDOMCustomEvent;
