// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import {uniqueID} from '../src/index.js';

class DemoHTMLFilePicker extends React.PureComponent {

  _id = uniqueID();

  render(): React.Element<any> {
    return (
      <div>
        <b>Select a HTML File to insert</b>
        <div className="docs-text-input-editor">
          <input
            className="form-control"
            id={this._id}
            type="file"
          />
          <Button
            bsSize="small"
            bsStyle="primary"
            onClick={this._confirm}>
            Done
          </Button>
          <Button
            bsSize="small"
            onClick={this.props.onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  _onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  }

  _confirm = () => {
    const el: any = document.getElementById(this._id);
    if (!el || !el.files) {
      return;
    }
    const file = el.files[0];
    if (!file || !(/\.html$/).test(file.name)) {
      return;
    }
    const reader: any = new FileReader();
    reader.onload = (onload) => {
      const html = onload.target.result;
      reader.onload = null;
      this.props.onConfirm(html);
    };
    reader.readAsText(file);
  };
}

export default DemoHTMLFilePicker;
