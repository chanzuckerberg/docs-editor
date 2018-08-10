'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
function getSafeBodyFromHTML(html) {
  var doc = void 0;
  var root = null;
  // Provides a safe context
  if (document.implementation && document.implementation.createHTMLDocument) {
    doc = document.implementation.createHTMLDocument('');
    (0, _invariant2.default)(doc.documentElement, 'Missing doc.documentElement');
    doc.documentElement.innerHTML = html;
    root = doc.getElementsByTagName('body')[0];
  }
  return root;
}

exports.default = getSafeBodyFromHTML;