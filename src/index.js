// @flow

import DocsContext from './DocsContext';
import DocsEditor from './DocsEditor';
import React from 'react';
import docsConvertFromRawContentState from './docsConvertFromRawContentState';
import noop from './noop';
import {EditorState} from 'draft-js';

const DEFAULT_CONTEXT = new DocsContext({});
const DEFAULT_EDITOR_STATE = docsConvertFromRawContentState({});

class Editor extends React.PureComponent {
  props: {
    className?: ?string,
    disabled?: ?boolean,
    docsContext: ?Object,
    editorState: EditorState,
    height?: ?(string | number),
    id?: ?string,
    maxContentHeight?: ?number,
    onBlur?: () => void,
    onChange?: (e: EditorState) => void,
    placeholder?: ?string,
    width?: ?(string | number),
  };

  render(): React.Element<any> {
    let {
      docsContext,
      editorState,
      onBlur,
      onChange,
      ...restProps,
    } = this.props;

    return (
      <DocsEditor
        {...restProps}
        docsContext={docsContext || DEFAULT_CONTEXT}
        editorState={editorState || DEFAULT_EDITOR_STATE}
        onBlur={onBlur || noop}
        onChange={onChange || noop}
      />
    );
  }
}

module.exports = {
  DEFAULT_CONTEXT,
  DEFAULT_EDITOR_STATE,
  Editor,
};
