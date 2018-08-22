// @flow

import DocsActionTypes from './DocsActionTypes';
import DocsContext from './DocsContext';
import DocsDropdownButton from './DocsDropdownButton';
import DocsImageUploadControl from './DocsImageUploadControl';
import DocsMenuItem from './DocsMenuItem';
import DocsSafeImage from './DocsSafeImage';
import Input from './DocsInput';
import React from 'react';
import withDocsContext from './withDocsContext';

import {Alert, Button} from 'react-bootstrap';
import {setURL} from './DocsImageModifiers';

import './DocsImageEditor.css';

import type {DocsImageEntityData, ImageLike} from './Types';

type Props = {
  docsContext: DocsContext,
  entityData: DocsImageEntityData,
  onCancel: () => void,
  onConfirm: (o: DocsImageEntityData) => void,
};

type State = {
  data: DocsImageEntityData,
  errorMessage: string,
  isUploading: boolean,
  isValidating: boolean,
  validatedImage: ?ImageLike,
};

const ENTER_CODE = 13;

const SPECS = [
  {
    action: DocsActionTypes.IMAGE_ALIGN_LEFT,
    label: 'Align Left',
    prop: 'align',
    value: 'left',
  },
  {
    action: DocsActionTypes.IMAGE_ALIGN_RIGHT,
    label: 'Align Right',
    prop: 'align',
    value: 'right',
  },
  {
    action: DocsActionTypes.IMAGE_ALIGN_CENTER,
    label: 'Align Center',
    prop: 'align',
    value: 'center',
  },
  // {
  //   action: DocsActionTypes.IMAGE_ALIGN_NONE,
  //   label: 'Align None',
  //   prop: 'align',
  //   value: false,
  // },
  {
    divider: true,
  },
  {
    action: DocsActionTypes.IMAGE_TOGGLE_FRAME,
    label: 'Toggle Frame',
    prop: 'frame',
    value: true,
  },
];

function getInitialState(props: Props): State {
  const data = props.entityData || {};
  const {url, width, height} = data;
  const validatedImage = (url && width && height) ?
    {
      src: url,
      width,
      height,
      id: '',
    } :
    null;

  return {
    data,
    errorMessage: '',
    isUploading: false,
    isValidating: false,
    validatedImage,
  };
}

/**
 * This component let you to select a valid image and only valid image can be
 * selected.
*/
class DocsImageEditor extends React.PureComponent {
  props: Props;

  state: State = getInitialState(this.props);

  render(): React.Element<any> {
    const {runtime} = this.props.docsContext;
    const {
      errorMessage, data, isUploading,
      isValidating, validatedImage,
    } = this.state;
    const {url} = data;
    const items = SPECS.map((spec: Object, index) => {
      const {label, prop, value, divider} = spec;
      if (divider) {
        return (
          <DocsMenuItem
            divider={true}
            key={'divider' + String(index)}
          />
        );
      }
      let active = false;

      if (typeof value === 'boolean') {
        active = !!data[prop];
      } else if (prop === 'align' && value === 'center') {
        const val = data[prop];
        active = (val === value) || !val;
      } else {
        active = data[prop] === value;
      }

      return (
        <DocsMenuItem
          active={active}
          key={spec.action}
          label={label}
          onClick={this._onMenuItemClick}
          value={spec}
        />
      );
    });

    const uploadControl = runtime && runtime.canUploadImage() ?
      <span className="docs-image-editor-upload-control">
        <DocsImageUploadControl
          disabled={isUploading || isValidating}
          onError={this._onUploadError}
          onStart={this._onUploadStart}
          onSuccess={this._onUploadSuccess}
          runtime={runtime}
        />
      </span> :
      null;

    let alert = null;
    if (errorMessage) {
      alert = (
        <Alert bsStyle="danger">
          <b>Error</b>{' : '}
          {errorMessage}
        </Alert>
      );
    } else if (isValidating || isUploading) {
      alert = (
        <Alert bsStyle="info">
          processing
        </Alert>
      );
    }

    const preview = url ?
      <div
        className="docs-image-editor-preview"
        style={{backgroundImage: `url(${url})`}}>
        <DocsSafeImage
          height={1}
          onError={this._onValidateError}
          onLoad={this._onValidateSuccess}
          src={url}
          width={1}
        />
        {alert}
      </div> :
      null;

    return (
      <div className="docs-image-editor">
        <div className="docs-image-editor-inputs">
          <DocsDropdownButton title="Styles">
            {items}
          </DocsDropdownButton>
          <Input
            onChange={this._onUrlChange}
            onKeyDown={this._onKeyDown}
            placeholder="Enter image url"
            readOnly={isUploading}
            type="text"
            value={url || ''}
          />
          {uploadControl}
        </div>
        <div>
          {preview}
        </div>
        <div className="docs-image-editor-buttons">
          <Button
            bsSize="small"
            bsStyle="primary"
            disabled={!validatedImage}
            onClick={this._confirm}>
            Apply
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

  _onKeyDown = (e: any): void => {
    const {keyCode} = e;
    const {url} = this.state.data;
    if (keyCode === ENTER_CODE && url) {
      this._confirm();
    }
  };

  _onMenuItemClick = (spec: Object): void => {
    const {data} = this.state;
    let {align, frame} = data;
    switch (spec.action) {
      case DocsActionTypes.IMAGE_ALIGN_LEFT:
        align = 'left';
        break;

      case DocsActionTypes.IMAGE_ALIGN_RIGHT:
        align = 'right';
        break;

      case DocsActionTypes.IMAGE_ALIGN_CENTER:
        align = 'center';
        break;

      case DocsActionTypes.IMAGE_ALIGN_NONE:
        align = '';
        break;

      case DocsActionTypes.IMAGE_TOGGLE_FRAME:
        frame = !frame;
        break;
      default:
        return;
    }

    this.setState({
      data: {
        ...data,
        align,
        frame,
      },
    });
  };

  _confirm = () => {
    const {onConfirm, entityData} = this.props;
    const {data, validatedImage} = this.state;
    if (validatedImage) {
      onConfirm({
        ...data,
        height: entityData.height || data.height,
        width: entityData.width || data.width,
      });
    }
  };

  _cancel = () => {
    const {onCancel} = this.props;
    onCancel();
  };

  _onUrlChange = (e: any): void => {
    this.setState({
      data: setURL(this.state.data, e.target.value),
      errorMessage: '',
      isValidating: true,
      validatedImage: null,
    });
  };

  _onValidateSuccess = (image: ImageLike): void => {
    const {data} = this.state;
    const {src, width, height} = image;
    this.setState({
      data: {
        ...data,
        height,
        url: src,
        width,
      },
      isValidating: false,
      validatedImage: image,
    });
  };

  _onValidateError = (error: Error): void => {
    this.setState({
      isValidating: false,
      validatedImage: null,
      errorMessage: error.message,
    });
  };

  _onUploadStart = (): void => {
    this.setState({
      errorMessage: '',
      isUploading: true,
      validatedImage: null,
    });
  };

  _onUploadSuccess = (image: ImageLike): void => {
    const {src, width, height} = image;
    const {data} = this.state;
    this.setState({
      data: {
        ...data,
        url: src,
        width,
        height,
      },
      isUploading: false,
      // The image will be validated by <DocsSafeImage /> after the new url is
      // assigned.
      isValidating: true,
      validatedImage: null,
    });
  };

  _onUploadError = (error: Error): void => {
    this.setState({
      errorMessage: error.message,
      isUploading: false,
      isValidating: false,
      validatedImage: null,
    });
  };
}

module.exports = withDocsContext(DocsImageEditor);
