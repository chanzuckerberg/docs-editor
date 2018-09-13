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

function updateDecoratorEntityData(
  editorState: EditorState,
  entityKey: string,
  entityData: Object,
  contentBlock: ContentBlock,
): EditorState {
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


function updateEntityData(
  editorState: EditorState,
  entityKey: string,
  entityData: Object,
): EditorState {
  debugger;
  const contentState = editorState.getCurrentContent();
  const contentEntity = contentState.getEntity(entityKey);
  if (!contentEntity) {
    debugger;
    return createEntityData(editorState, entityKey, entityData);
  }
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const blocks = contentState.getBlocksAsArray();
  const contentBlock = blocks.find(b => b.getKey() === anchorKey);
  if (contentBlock) {
    const contentLength = contentBlock.getLength();
    for (let kk = 0; kk < contentLength; kk++) {
      const entity = contentBlock.getEntityAt(kk);
      if (entity === entityKey) {
        debugger;
        // This happens when the entity belongs to a decorator component.
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

  for (let ii = 0, jj = blocks.length; ii < jj; ii++) {
    const contentBlock = blocks[ii];
    if (contentBlock.getType() !== 'atomic') {
      continue;
    }
    // This happens when the entity belongs to a atomic component.
    const entity = contentBlock.getEntityAt(0);
    if (entity === entityKey) {
      debugger;
      return updateContentBlockEntityData(
        editorState,
        entityKey,
        entityData,
        contentBlock,
        0,
      );
    }
  }

  debugger;
  return editorState;
}

export default updateEntityData;
