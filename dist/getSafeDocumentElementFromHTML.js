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
var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocumentLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocumentLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsTableEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsTableEntityData || require('prop-types').any;

function getSafeDocumentElementFromHTML(html, domDocument) {
  var root = null;

  if (/<body[\s>]/i.test(html) === false) {
    html = '<!doctype><html><body>' + html + '</body></html>';
  }

  // Provides a safe context
  if (domDocument) {
    domDocument.open();
    domDocument.write(html);
    domDocument.close();
    root = domDocument.getElementsByTagName('html')[0];
  } else if (typeof document !== 'undefined' && document.implementation && document.implementation.createHTMLDocument) {
    var doc = document.implementation.createHTMLDocument('');
    doc.open();
    doc.write(html);
    doc.close();
    root = doc.getElementsByTagName('html')[0];
  }
  return root;
}

exports.default = getSafeDocumentElementFromHTML;