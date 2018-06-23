// @flow

import DocsContext from './DocsContext';
import DocsDataAttributes from './DocsDataAttributes';
import DocsEditor from './DocsEditor';
import React from 'react';
import {EditorState} from './DraftJS';
import {uniqueID} from './DocsHelpers';

class DocsPage extends React.PureComponent {

  _id = uniqueID();

  props: {
    docsContext: DocsContext,
    initialEditorState: EditorState,
    onChange: (e: EditorState) => void,
  };

  state = {
    editorState: this.props.initialEditorState,
  };

  render(): React.Element<any> {
    const attrs = {
      [DocsDataAttributes.EDITOR_FOR]: this._id,
    };
    const {editorState} = this.state;
    return (
      <div className="docs-demo-page"  {...attrs}>
        <div className="docs-demo-editor">
          <DocsEditor
            docsContext={this.props.docsContext}
            editorState={editorState}
            id={this._id}
            onChange={this._onChange}
          />
        </div>
      </div>
    );
  }

  _onChange = (editorState: EditorState): void => {
    this.setState({editorState});
    this.props.onChange(editorState);
  };
}

module.exports = DocsPage;
