// @flow

import AbstractBehavior from './AbstractBehavior';
import DocsActionTypes from './DocsActionTypes';
import DocsBlockTypes from './DocsBlockTypes';
import DocsContext from './DocsContext';
import hasNoSelection from './hasNoSelection';
import returnFalse from './returnFalse';
import returnTrue from './returnTrue';
import {EditorState} from 'draft-js';
import {insertCustomBlock} from './DocsModifiers';
import {pasteHTML} from './DocsModifiers';

import type {ModalHandle} from './showModalDialog';
import type {OnChange} from './AbstractBehavior';


class HTMLDocumentBehavior extends AbstractBehavior {
  constructor() {
    super({
      action: DocsActionTypes.HTML_INSERT,
      icon: 'assignment',
      label: 'Insert HTML',
    });
  }

  isEnabled = (e: EditorState): boolean => {
    return hasNoSelection(e);
  }

  execute = (
    editorState: EditorState,
    onChange: OnChange,
    docsContext: DocsContext,
  ): ?ModalHandle => {
    const loadHTML = docsContext.runtime && docsContext.runtime.loadHTML;
    if (loadHTML) {
      (async function() {
        const html = await loadHTML();
        if (typeof html !== 'string' || !html) {
          // cancelled;
          return;
        }
        onChange(
          pasteHTML(
            editorState,
            html,
          ),
        );
      })();
    }
    return null;
  };
}

export default HTMLDocumentBehavior;
