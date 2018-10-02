// @flow
// https://github.com/thibaudcolas/draftjs-filters/blob/ad9ebbd35c71319d7889da3334e23a37ee973f0f/src/lib/filters/entities.js#L72-L119

import {APPLY_ENTITY} from './DocsEditorChangeType';
import {EditorState, Modifier, Entity, CharacterMetadata} from 'draft-js';

// We need this because we don't have explicilt selection needed to clear
// comments. 
export default function deleteCommentThread(
  editorState: EditorState,
  commentThreadId: string,
): EditorState {
  let changed = false;
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().map((block, key) => {
    let charsListChanged = false;
    const charsList = block.getCharacterList().map(char => {
      const entityKey = char.getEntity();
      if (!entityKey) {
        return char;
      }
      const entity = contentState.getEntity(entityKey);
      const entityData = entity.getData();
      if (entityData.commentThreadId !== commentThreadId) {
        return char;
      }
      charsListChanged = true;
      changed = true;
      return CharacterMetadata.applyEntity(char, null);
    });

    return charsListChanged ? block.set("characterList", charsList) : block;
  });
  if (!changed) {
    return editorState;
  }
  const contentStateNext = contentState.merge({blockMap});
  return EditorState.push(editorState, contentStateNext, APPLY_ENTITY);
}
