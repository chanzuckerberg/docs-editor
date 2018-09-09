// @flow

import DocsDecorator from './DocsDecorator';
import {ContentBlock, Modifier, EditorState} from 'draft-js';
import {APPLY_ENTITY} from './DocsEditorChangeType';

function createEntityData(
  editorState: EditorState,
  entityKey: string,
  entityData: Object,
): EditorState {
  // calling `contentState.replaceEntityData` mutates the linked enity data
  // that is mutable directly.
  const contentState = editorState.getCurrentContent();
  contentState.replaceEntityData(entityKey, entityData);
  return EditorState.createWithContent(
    contentState,
    DocsDecorator.get(),
  );
}

function updateContentBlockEntityData(
  editorState: EditorState,
  entityKey: string,
  entityData: Object,
  contentBlock: ContentBlock,
  anchorOffset: number,
): EditorState {
  const contentBlockKey = contentBlock.getKey();
  // Create a fake selection to that we can update the entity data
  // with `Modifier.applyEntity.`
  const selection = editorState.getSelection().merge({
    focusKey: contentBlockKey,
    anchorKey: contentBlockKey,
    anchorOffset: anchorOffset,
    focusOffset: anchorOffset + 1,
    isBackward: false,
    hasFocus: false,
  });

  let contentState = editorState.getCurrentContent();
  const entity = contentState.getEntity(entityKey);
  if (!entity) {
    // Warning: It should not end here.
    return editorState;
  }

  // Remove the old entity.
  contentState = Modifier.applyEntity(
    contentState,
    selection,
    null,
  );

  // Create a new entity.
  contentState = contentState.createEntity(
    entity.getType(),
    entity.getMutability(),
    entityData,
  );

  contentState = Modifier.applyEntity(
    contentState,
    selection,
    contentState.getLastCreatedEntityKey(),
  );

  return EditorState.push(editorState, contentState, APPLY_ENTITY);
}

function updateEntityData(
  editorState: EditorState,
  entityKey: string,
  entityData: Object,
): EditorState {
  const contentState = editorState.getCurrentContent();
  const contentEntity = contentState.getEntity(entityKey);
  if (!contentEntity) {
    return createEntityData(editorState, entityKey, entityData);
  }

  const blocks = contentState.getBlocksAsArray();
  for (let ii = 0, jj = blocks.length; ii < jj; ii++) {
    const contentBlock = blocks[ii];
    const contentLength = contentBlock.getLength();
    for (let kk = 0; kk < contentLength; kk++) {
      const entity = contentBlock.getEntityAt(kk);
      if (entity === entityKey) {
        return updateContentBlockEntityData(
          editorState,
          entityKey,
          entityData,
          contentBlock,
          kk,
        );
      }
    }
  }

  return editorState;
}

export default updateEntityData;
