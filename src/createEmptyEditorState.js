// @flow

import DocsDecorator from './DocsDecorator';
import {EditorState} from 'draft-js';

let emptyEditorState = null;

function createEmptyEditorState(): EditorState {
  if (!emptyEditorState) {
    const decorator = DocsDecorator.get();
    emptyEditorState = EditorState.createEmpty(decorator);
  }
  return emptyEditorState;
}

export default createEmptyEditorState;
