import convertToRaw from '../src/convertToRaw';
import convertFromHTML from '../src/convertFromHTML';

function convertFromHTMLForRuntime(html) {
  return convertFromHTML(
    html,
    null, // editorState?: ?EditorState,
    null, // domDocument?: ?DocumentLike,
    null, // cssRules?: ?CSSRules,
    true, // purgeConsecutiveBlankLines?: ?boolean,
  );
}

const docsEditorRuntime = {
  convertFromHTML: convertFromHTMLForRuntime,
  convertToRaw,
};

window.docsEditorRuntime = window.docsEditorRuntime || docsEditorRuntime;
