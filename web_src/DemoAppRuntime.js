// @flow

import DemoHTMLFilePicker from './DemoHTMLFilePicker';
import showModalDialog from '../src/showModalDialog';
import {DocsEditorRuntime} from '../src/index.js';
import uniqueID from '../src/uniqueID';

class DemoAppRuntime extends DocsEditorRuntime {
  canLoadHTML() {
    return true;
  }
  canComment() {
    return true;
  }
  loadHTML() {
    return new Promise(resolve => {
      showModalDialog(DemoHTMLFilePicker, {}, (html) => {
        resolve(html);
      });
    });
  }
  createCommentID() {
    return `demo-app-comment-${uniqueID()}`;
  }
}

export default DemoAppRuntime;
