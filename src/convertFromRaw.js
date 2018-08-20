// @flow
import DocsDecorator from './DocsDecorator';
import {convertFromRaw as draftJSConvertFromRaw, EditorState} from 'draft-js';

type ObjectLike = any;

function convertFromRaw(
  rawContentState: ObjectLike,
  editorState?: ?EditorState,
): EditorState {
  const decorator = DocsDecorator.get();
  if (rawContentState !== null && typeof rawContentState === 'object') {
    let contentState;
    try {
      contentState = draftJSConvertFromRaw(rawContentState);
    } catch (ex) {
      // pass
    }

    if (contentState) {
      return editorState ?
        EditorState.push(editorState, contentState) :
        EditorState.createWithContent(contentState, decorator);
    }
  }
  return EditorState.createEmpty(decorator);
}

module.exports = convertFromRaw;
