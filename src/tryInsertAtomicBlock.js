// @flow

import warn from './warn';
import {AtomicBlockUtils, EditorState} from 'draft-js';

// Core helper function.
// Do not require any Component or Modifier in this file to avoid circular
// dependiencies.

function tryInsertAtomicBlock(
  editorState: EditorState,
  entityKey: string,
  text: string,
): ?EditorState {
  try {
    return AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      text,
    );
  } catch (ex) {
    warn(ex);
    return null;
  }
}

export default tryInsertAtomicBlock;
