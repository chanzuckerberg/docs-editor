
import {DocsEditor, DocsContext, EditorState, convertToRaw, convertFromRaw, convertFromHTML, uniqueID} from '../src/index.js';

if (!window.docsEditorRuntime) {
  window.docsEditorRuntime = {
    convertToRaw,
    convertFromHTML,
  };
}
