// @flow

import {EditorState} from 'draft-js';

function isEditorStateEmpty(editorState: EditorState): boolean {
  const contentState = editorState.getCurrentContent();
  const hasText = contentState.hasText();
  if (hasText) {
    return false;
  }
  const blockMap = contentState.getBlockMap();
  if (blockMap.size > 1) {
    return false;
  }
  if (blockMap.size === 1) {
    return blockMap.first().getType() === 'unstyled';
  }
  return true;
}

export default isEditorStateEmpty;
