// @flow

import DocsMathEditorGuide  from './DocsMathEditorGuide';
import React from 'react';
import {Button} from 'react-bootstrap';
import uniqueID from './uniqueID';

import './DocsMathEditor.css';

import type {MathEntityData} from './Types';

type Props = {
  entityData: MathEntityData,
  onCancel: () => void,
  onConfirm: (v: MathEntityData) => void,
};

type State = {
  contentHeight: number,
  contentWidth: number,
  showGuide: boolean,
  symbolsGuide: ?Object,
};

// See http://cdn.summitlearning.org/assets/example_react_math_input_app_0_0_3_5.html
type MessageDetail = {
  id: string,
  value: MathEntityData,
  contentLayout: {
    height: number,
    width: number,
  },
  symbolsGuide: {[string]: string},
};


// This file is manually built and uploaded to S3.
// See https://github.com/FB-PLP/react-math-input-app
const GUPPY_CDN_URL =
  '//cdn.summitlearning.org/assets/app_react_math_input_app_0_0_3_8.html';

class DocsMathEditor extends React.PureComponent {
  _id = uniqueID();
  _inputValue = null;
  _unmounted = false;

  props: Props;

  state: State = {
    contentHeight: 0,
    contentWidth: 0,
    showGuide: false,
    symbolsGuide: null,
  };

  render(): React.Element<any> {
    const {entityData} = this.props;
    const {showGuide, contentWidth, contentHeight, symbolsGuide} = this.state;
    const id = this._id;
    const params = JSON.stringify({
      value: entityData,
      id,
    });

    const src = GUPPY_CDN_URL + '#' + window.encodeURIComponent(params);
    const toggleText = showGuide ? '[-] hide guide [-]' : '[+] show guide';
    const guideToggle =
      <a href="#" onClick={this._onGuideToggleClick}>
        {toggleText}
      </a>;
    const iframeStyle = {
      height: Math.max(contentHeight, 80) + 'px',
      width: Math.max(contentWidth, 500) + 'px',
      opacity: symbolsGuide ? 1 : 0,
    };
    // The math input must be hosted as a sandboxed app because it observe
    // DOM events at global level and it does not release the event handlers
    // when the editor si closed.
    return (
      <div
        className="docs-math-editor"
        id={id}>
        <div className="docs-math-editor-border">
          <div className="docs-math-editor-scroll">
            <iframe
              className="docs-math-editor-iframe"
              src={src}
              style={iframeStyle}
            />
          </div>
        </div>
        {this._renderGuide()}
        <div className="docs-math-editor-body">
          <div className="docs-math-editor-toggle">
            {guideToggle}
          </div>
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
      </div>
    );
  }

  componentDidMount(): void {
    window.addEventListener('message', this._onMessage, false);
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    window.removeEventListener('message', this._onMessage, false);
  }

  _confirm = (): void => {
    const {entityData, onConfirm} = this.props;
    onConfirm(this._inputValue || entityData);
  };

  _cancel = (): void => {
    this.props.onCancel();
  };

  _renderGuide(): ?React.Element<any> {
    const {showGuide, symbolsGuide} = this.state;
    if (!symbolsGuide || !showGuide) {
      return null;
    }
    return <DocsMathEditorGuide symbolsGuide={symbolsGuide} />;
  }

  _onGuideToggleClick = (e: any): void => {
    e.preventDefault();
    const {showGuide} = this.state;
    this.setState({showGuide: !showGuide});
  };

  _onMessage = (e: any): void => {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (ex) {
      return;
    }
    if (!data || !data.detail || data.detail.id !== this._id) {
      return;
    }

    const detail: MessageDetail = data.detail;
    const {value, contentLayout, symbolsGuide} = detail;
    if (!this.state.symbolsGuide) {
      this.setState({
        symbolsGuide,
      });
    }
    this.setState({
      contentHeight: contentLayout.height,
      contentWidth: contentLayout.width,
    });

    this._inputValue = value;
  };
}

module.exports = DocsMathEditor;
