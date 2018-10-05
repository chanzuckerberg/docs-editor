// @flow

import DemoComment from './DemoComment';
import DemoHTMLFilePicker from './DemoHTMLFilePicker';
import React from 'react';
import showModalDialog from '../src/showModalDialog';
import uuid4 from 'uuid4';
import {DocsEditorRuntime} from '../src/index.js';

import type {RenderCommentProps} from '../src/Types';

class DemoAppRuntime extends DocsEditorRuntime {
  canLoadHTML(): boolean {
    return true;
  }

  canComment(): boolean {
    return true;
  }

  loadHTML(): Promise<?string> {
    return new Promise(resolve => {
      showModalDialog(DemoHTMLFilePicker, {}, (html) => {
        resolve(html);
      });
    });
  }

  createCommentThreadID(): string {
    return `doc/123/comment-thread/${uuid4()}`;
  }

  renderComment(props: RenderCommentProps): ?React.Element<any> {
    return <DemoComment {...props} />;
  }
}

export default DemoAppRuntime;
