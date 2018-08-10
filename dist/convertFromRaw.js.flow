// @flow
import DocsDecorator from './DocsDecorator';
import {convertFromRaw, EditorState} from 'draft-js';

type ObjectLike = any;

function convertFromRawWithDocsDecorator(
  rawContentState: ObjectLike,
  editorState?: ?EditorState,
): EditorState {
  const decorator = DocsDecorator.get();
  if (rawContentState !== null && typeof rawContentState === 'object') {
    let contentState;
    try {
      contentState = convertFromRaw(rawContentState);
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

module.exports = convertFromRawWithDocsDecorator;
