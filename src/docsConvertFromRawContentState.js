// @flow
import DocsDecorator from './DocsDecorator';
import {convertFromRaw, EditorState} from 'draft-js';

type ObjectLike = any;

function docsConvertFromRawContentState(
  rawContentState: ObjectLike,
): EditorState {
  const decorator = DocsDecorator.get();
  if (rawContentState !== null && typeof rawContentState === 'object') {
    try {
      const contentState = convertFromRaw(rawContentState);
      return EditorState.createWithContent(contentState, decorator);
    } catch (ex) {
      // pass
    }
  }
  return EditorState.createEmpty(decorator);
}

module.exports = docsConvertFromRawContentState;
