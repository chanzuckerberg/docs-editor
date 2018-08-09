// @flow

// TODO: Type Range properly.

function getDOMSelectionRange(): ?Object {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  return selection.getRangeAt(0);
}

export default getDOMSelectionRange;
