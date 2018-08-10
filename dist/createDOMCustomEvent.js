"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// Core helper function.
// Do not require any Component or Modifier in this file to avoid circular
// dependiencies.

var _window = window,
    CustomEvent = _window.CustomEvent;


function createDOMCustomEvent(type, bubbles, cancelable, detail) {
  if (detail === undefined) {
    detail = null;
  }
  return new CustomEvent(type, { bubbles: bubbles, cancelable: cancelable, detail: detail });
}

exports.default = createDOMCustomEvent;