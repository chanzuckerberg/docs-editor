// @flow

import {EditorState, Entity} from 'draft-js';

import tryGetEntityAtContentState from './tryGetEntityAtContentState';

function getCurrentSelectionEntity(editorState: EditorState): ?Entity {
  const selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return null;
  }
  const contentState = editorState.getCurrentContent();
  const startKey = editorState.getSelection().getStartKey();
  const startOffset = editorState.getSelection().getStartOffset();
  const blockWithEntityAtBeginning = contentState.getBlockForKey(startKey);
  if (!blockWithEntityAtBeginning) {
    return null;
  }
  const entityKey = blockWithEntityAtBeginning.getEntityAt(startOffset);
  if (!entityKey) {
    return null;
  }
  return tryGetEntityAtContentState(contentState, entityKey);
}

export default getCurrentSelectionEntity;
