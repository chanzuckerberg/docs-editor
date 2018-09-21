// @flow

import AbstractBehavior from './AbstractBehavior';
import DocsActionTypes from './DocsActionTypes';
import DocsBlockTypes from './DocsBlockTypes';
import DocsContext from './DocsContext';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import getCurrentSelectionEntity from './getCurrentSelectionEntity';
import hasSelection from './hasSelection';
import returnFalse from './returnFalse';
import returnTrue from './returnTrue';
import uniqueID from './uniqueID';
import {APPLY_ENTITY} from './DocsEditorChangeType';
import {EditorState, Modifier, Entity} from 'draft-js';
import {insertCustomBlock} from './DocsModifiers';
import {pasteHTML} from './DocsModifiers';

import type {ModalHandle} from './showModalDialog';
import type {OnChange} from './AbstractBehavior';

function getEntity(editorState: EditorState): ?Entity {
  const entity = getCurrentSelectionEntity(editorState);
  return entity && entity.getType() === DocsDecoratorTypes.DOCS_COMMENT ?
    entity :
    null;
}

function addComment(
  editorState: EditorState,
  commentID: string,
): EditorState {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    DocsDecoratorTypes.DOCS_COMMENT,
    'MUTABLE',
    {
      clientID: commentID,
    },
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newContentState = Modifier.applyEntity(
    contentStateWithEntity,
    selection,
    entityKey,
  );
  return EditorState.push(editorState, newContentState, APPLY_ENTITY);
}

function currentBlockContainsComment(editorState: EditorState): boolean {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const entityMap = contentState.getEntityMap();
  return contentState
    .getBlockForKey(selection.getAnchorKey())
    .getCharacterList()
    .slice(selection.getStartOffset(), selection.getEndOffset())
    .some(v => {
      const entityKey = v.getEntity();
      if (entityKey) {
        const entity = contentState.getEntity(entityKey);
        return entity.getType() === DocsDecoratorTypes.DOCS_COMMENT;
      } else {
        return false;
      }
    });
}

class CommentsBehavior extends AbstractBehavior {
  constructor() {
    super({
      action: DocsActionTypes.COMMENT_ADD,
      icon: 'comment',
      label: 'Add Comment',
    });
  }

  isEnabled = (editorState: EditorState): boolean => {
    return (
      hasSelection(editorState) &&
      !currentBlockContainsComment(editorState)
    );
  }

  isActive = (editorState: EditorState): boolean => {
    return false;
  }

  execute = (
    editorState: EditorState,
    onChange: OnChange,
    docsContext: DocsContext,
  ): ?ModalHandle => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed() || currentBlockContainsComment(editorState)) {
      return null;
    }

    const commentID = docsContext.runtime &&
      docsContext.runtime.createCommentID &&
      docsContext.runtime.createCommentID();

    commentID && onChange(addComment(editorState, commentID));
  };
}

export default CommentsBehavior;
