// @flow

import Input from './DocsInput';
import React from 'react';
import Timer from './lib/Timer';
import {Button} from 'react-bootstrap';
import {tryFocus, uniqueID} from './DocsHelpers';

type Props = {
  value: ?string,
  onCancel: () => void,
  onConfirm: (v: ?string) => void,
};

const ENTER_CODE = 23;

class DocsTextInputEditor extends React.PureComponent {
  _id = uniqueID();
  _timer = new Timer();

  props: Props;

  state = {
    value: this.props.value || '',
  };

  componentDidMount(): void {
    this._timer.set(this._autoFocus, 350);
  }

  componentWillUnmount(): void {
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const {value} = this.state;
    const id = this._id;
    return (
      <div className="docs-text-input-editor">
        <Input
          id={id}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          type="text"
          value={value}
        />
        <Button
          bsSize="small"
          bsStyle="primary"
          onClick={this._confirm}>
          Done
        </Button>
        <Button
          bsSize="small"
          onClick={this._cancel}>
          Cancel
        </Button>
      </div>
    );
  }

  _onKeyDown = (e: any): void => {
    const {keyCode} = e;
    const {onConfirm} = this.props;
    keyCode === ENTER_CODE && onConfirm(this.state.value);
  };

  _onChange = (e: any): void =>{
    this.setState({value: e.target.value});
  };

  _autoFocus = (): void => {
    const input = document.getElementById(this._id);
    tryFocus(input);
  };

  _confirm = (): void => {
    this.props.onConfirm(this.state.value);
  };

  _cancel = (): void => {
    this.props.onCancel();
  };
}

module.exports = DocsTextInputEditor;
