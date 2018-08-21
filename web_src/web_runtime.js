import convertToRaw from '../src/convertToRaw';
import convertFromHTML from '../src/convertFromHTML';

const docsEditorRuntime = {
  convertFromHTML,
  convertToRaw,
};

window.docsEditorRuntime = window.docsEditorRuntime || docsEditorRuntime;
