// @flow

import React from 'react';
import {Button} from 'react-bootstrap';

import './DocsEditorContentOverflowControl.css'

class DocsEditorContentOverflowControl extends React.PureComponent {
  props: {
    contentOverflowHidden: boolean,
    onToggle: (value: boolean) => void,
  };

  render(): React.Element<any> {
    const {contentOverflowHidden} = this.props;
    const icon = contentOverflowHidden ? '\u00BB' : '\u00AB';
    const text = contentOverflowHidden ? 'Read more' : 'Read less';
    return (
      <Button
        aria-expanded={!contentOverflowHidden}
        bsStyle="link"
        className="docs-editor-content-overflow-control"
        onClick={this._onClick}
        /*
          Handles a design issue where the button remains focused after clicking it,
          so rectangular keyboard focus still shows. Using a suggestion from
          https://stackoverflow.com/a/37580028 to show focus for keyboard users
          while hiding focus for mouse users.
        */
        onMouseDown={e => e.preventDefault()}
      >
        <span aria-hidden="true" className="icon">{icon}</span>
        {text}
      </Button>
    );
  }

  _onClick = (e: SyntheticEvent): void => {
    const {contentOverflowHidden, onToggle} = this.props;
    onToggle(!contentOverflowHidden);
  };
}

module.exports = DocsEditorContentOverflowControl;
