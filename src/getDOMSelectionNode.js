// @flow

function getDOMSelectionNode(): ?Element {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  const range: any = selection.getRangeAt(0);
  let node = range.commonAncestorContainer;
  if (node && node.nodeType === 3) {
    // TEXT_NODE
    node = node.parentNode;
  }
  return node || null;
}

export default getDOMSelectionNode;
