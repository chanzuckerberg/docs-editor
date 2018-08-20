// @flow

import {EditorState, ContentState, convertToRaw as draftJSConvertToRaw} from 'draft-js';
import warn from './warn';

function convertToRaw(editorState: EditorState): Object {
  const state: any = editorState;
  let contentState;
  if (state instanceof ContentState) {
    // TODO: Fix all teh warnings.
    warn('convertToRaw should only accept EditorState, not ContentState');
    contentState = state;
  } else {
    contentState = editorState.getCurrentContent();
  }
  return draftJSConvertToRaw(contentState);
}

export default convertToRaw;
