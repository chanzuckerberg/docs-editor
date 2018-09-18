// @flow

import DemoHTMLFilePicker from './DemoHTMLFilePicker';
import showModalDialog from '../src/showModalDialog';
import {DocsEditorRuntime} from '../src/index.js';

class DemoAppRuntime extends DocsEditorRuntime {
  canLoadHTML() {
    return true;
  }
  loadHTML() {
    return new Promise(resolve => {
      showModalDialog(DemoHTMLFilePicker, {}, (html) => {
        resolve(html);
      });
    });
  }
}

export default DemoAppRuntime;
