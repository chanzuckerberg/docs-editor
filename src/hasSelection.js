// @flow

import {EditorState} from 'draft-js';

export default function hasSelection(editorState: EditorState): boolean {
  const selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
}
