'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _katex = require('katex');

var _katex2 = _interopRequireDefault(_katex);

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var latexEl = document.createElement('div');

function renderLatexAsHTML(latex) {
  var latexText = latex || '';
  latexEl.innerHTML = '';
  if (!latexText) {
    return latexText;
  }
  try {
    _katex2.default.render(latex, latexEl);
  } catch (ex) {
    (0, _warn2.default)(ex.message);
    latexEl.innerHTML = '';
    latexEl.appendChild(document.createTextNode(latexText));
  }
  var html = latexEl.innerHTML;
  latexEl.innerHTML = '';
  return html;
}

exports.default = renderLatexAsHTML;