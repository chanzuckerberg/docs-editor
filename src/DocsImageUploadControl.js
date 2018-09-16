// @flow

import DocsEditorRuntime from './DocsEditorRuntime';
import React from 'react';
import uniqueID from './uniqueID';

import type {ImageLike} from './Types';

type Props = {
  disabled?: ?boolean,
  onError: (e: Error) => void,
  onStart: () => void,
  onSuccess: (m: ImageLike) => void,
  runtime: DocsEditorRuntime,
};

class DocsImageUploadControl extends React.PureComponent {

  props: Props;

  state = {
    inputID: uniqueID(),
  };

  _unmounted = false;

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.Element<any> {
    const {inputID} = this.state;
    const {disabled} = this.props;
    return (
      <label className="docs-image-upload-control" htmlFor={inputID}>
        <span>Upload Image</span>
        <input
          accept="image/png,image/gif,image/jpeg,image/jpg"
          className="docs-image-upload-control-input"
          id={inputID}
          key={inputID}
          onChange={disabled ? null : this._onSelectFile}
          readOnly={disabled}
          type="file"
        />
      </label>
    );
  }

  _onSelectFile = (event: SyntheticInputEvent): void => {
    const file = event.target.files && event.target.files[0];
    if (file && typeof file === 'object') {
      this._upload(file);
    }
  };

  _upload = async (file: Object): Promise<void> => {
    try {
      const {runtime, onStart} = this.props;
      onStart();
      const image = await runtime.uploadImage(file);
      this._onSuccess(image);
    } catch (ex) {
      this._onError(ex);
    }
  };

  _onSuccess = (image: ImageLike): void => {
    if (this._unmounted) {
      return;
    }
    // Clear the selected file.
    this.setState({inputID: uniqueID()});
    this.props.onSuccess(image);
  };

  _onError = (error: Error): void => {
    if (this._unmounted) {
      return;
    }
    // Clear the selected file.
    this.setState({inputID: uniqueID()});
    this.props.onError(error);
  };
}

export default DocsImageUploadControl;
