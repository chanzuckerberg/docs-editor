"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function captureDocumentEvents(handlers, useBubble) {
  var doc = document;
  var callbacks = handlers;
  if (doc && callbacks) {
    (0, _keys2.default)(callbacks).forEach(function (type) {
      doc.addEventListener(type, handlers[type], !useBubble);
    });
  }
  return {
    dispose: function dispose() {
      if (doc && callbacks) {
        (0, _keys2.default)(callbacks).forEach(function (type) {
          doc.removeEventListener(type, handlers[type], !useBubble);
        });
        callbacks = null;
        doc = null;
      }
    }
  };
}

module.exports = captureDocumentEvents;