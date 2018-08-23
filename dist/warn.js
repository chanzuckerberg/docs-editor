"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEV_MODE = /localhost/.test(window.location.href);

function warn(ex) {
  if (DEV_MODE) {
    console.warn(ex);
  }
}

exports.default = warn;