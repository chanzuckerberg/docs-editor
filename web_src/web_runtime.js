import convertToRaw from './convertToRaw';
import convertFromHTML from './convertFromHTML';

const docsEditorRuntime = {
  convertFromHTML,
  convertToRaw,
};

window.docsEditorRuntime = window.docsEditorRuntime || docsEditorRuntime;
