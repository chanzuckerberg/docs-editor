// @flow

import DocsActionTypes from './DocsActionTypes';
import DocsContext from './DocsContext';
import {EditorState} from 'draft-js';

import type {ModalHandle} from './showModalDialog';

export type OnChange = (e: EditorState) => void;
export type Execute = (e: EditorState, o: OnChange, d: DocsContext) => ?ModalHandle;

export type Config = {
  action: string,
  icon: ?string,
  label: string,
};

class AbstractBehavior  {
  action: string;
  icon: ?string;
  label: string;

  constructor(config: Config) {
    Object.assign(this, config);
  }

  isActive = (e: EditorState): boolean => {
    return false;
  };

  isEnabled = (e: EditorState): boolean => {
    return false;
  };

  update = (e: EditorState, o: OnChange, d: DocsContext): ?ModalHandle => {
    return this.execute(e, o, d);
  };

  execute = (e: EditorState, o: OnChange, d: DocsContext): ?ModalHandle => {
    console.log('not supported');
    return null;
  };
}


function noop(
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
) {
  console.log('not supported');
}


export default AbstractBehavior;
