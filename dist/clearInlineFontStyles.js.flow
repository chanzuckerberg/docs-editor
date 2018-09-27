// @flow

function removeFontStyles(el: any): void {
  const style = el.style;
  if (style) {
    style.fontSize = '';
    style.fontWeight = '';
    style.lineHeight = '';
    style.color = '';
  }
}

export default function clearInlineFontStyles(el: Element): void {
  removeFontStyles(el);
  const all = el.querySelectorAll('*');
  Array.from(all).forEach(removeFontStyles);
}
