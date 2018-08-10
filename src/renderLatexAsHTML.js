// @flow

import katex from 'katex';
import warn from './warn';

const latexEl: any = document.createElement('div');

function renderLatexAsHTML(latex: ?string): string {
  const latexText = latex || '';
  latexEl.innerHTML = '';
  if (!latexText) {
    return latexText;
  }
  try {
    katex.render(latex, latexEl);
  } catch (ex) {
    warn(ex.message);
    latexEl.innerHTML = '';
    latexEl.appendChild(document.createTextNode(latexText));
  }
  const html = latexEl.innerHTML;
  latexEl.innerHTML = '';
  return html;
}

export default renderLatexAsHTML;
