"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// Core helper function.
// Do not require any Component or Modifier in this file to avoid circular
// dependiencies.

function createDOMCustomEvent(type, bubbles, cancelable, detail) {
  if (detail === undefined) {
    detail = null;
  }
  return new window.CustomEvent(type, { bubbles: bubbles, cancelable: cancelable, detail: detail });
}

exports.default = createDOMCustomEvent;