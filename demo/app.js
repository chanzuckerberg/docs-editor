// @flow

import React from 'react';
import {Editor, DEFAULT_CONTEXT, DEFAULT_EDITOR_STATE} from '../src/index';

import './app.css';


class App extends React.PureComponent<any, any, any> {
  state = {
    docsContext: DEFAULT_CONTEXT.merge({canEdit: true}),
    editorState: DEFAULT_EDITOR_STATE,
  };

  render(): React.Element<any> {
    const {docsContext, editorState} = this.state;
    return (
      <div id="app">
        <div className="main-column">
          <Editor
            docsContext={docsContext}
            editorState={editorState}
            height="100%"
            width="100%"
            onChange={this._onChange}
          />
        </div>
        <div className="side-column">
          {JSON.stringify(editorState.getCurrentContent().toJS(), null, 2)}
        </div>
      </div>
    );
  }

  _onChange = (editorState: Object): void => {
    this.setState({editorState});
  };
}

export default App;
