// @flow

import DocsContext from './DocsContext';
import DocsDataAttributes from './DocsDataAttributes';
import DocsImageEditor from './DocsImageEditor';
import DocsImageResizeHandle from './DocsImageResizeHandle';
import DocsSafeImage from './DocsSafeImage';
import React from 'react';
import ReactDOM from 'react-dom';
import ResizeObserver from './ResizeObserver';
import cx from 'classnames';
import docsWithContext from './docsWithContext';
import nullthrows from 'nullthrows';
import showModalDialog from './showModalDialog';
import {asElement, uniqueID} from './DocsHelpers';
import {setSize} from './DocsImageModifiers';

import type {ImageEntityData, DOMImage} from './Types';
import type {ModalHandle} from './showModalDialog';
import type {ResizeObserverEntry} from './ResizeObserver';

type Props = {
  entityData: ImageEntityData,
  onEntityDataChange: (o: ?ImageEntityData) => void,
};

type State = {
  editing: boolean,
  error: boolean,
  resizeChange: ?ImageEntityData,
};

function showImageEditorModalDialog(
  docsContext: DocsContext,
  entityData: ImageEntityData,
  callback: Function,
): ModalHandle {
  return showModalDialog(
    DocsImageEditor, {
    title: 'Edit Image',
    entityData,
    docsContext,
  }, callback);
}

class DocsImage extends React.Component {

  props: Props;

  _imageEditorModal = null;
  _imageID = uniqueID();
  _container = null;
  _unmounted = false;

  state: State = {
    error: false,
    editing: false,
    resizeChange: null,
  };

  componentWillUnmount(): void {
    this._unmounted = true;
    this._imageEditorModal && this._imageEditorModal.dispose();
  }

  render(): React.Element<any> {
    const {entityData} = this.props;
    const {url} = entityData;
    const {canEdit} = this.context.docsContext;
    const {editing, resizeChange} = this.state;
    let {width, height} = entityData;
    const resizeHandle = canEdit ?
      <DocsImageResizeHandle
        imageID={this._imageID}
        onImageResizeEnd={this._onImageResizeEnd}
      /> :
      null;
    const className = cx({
      'docs-image': true,
      'docs-image-editing': editing,
      'docs-image-with-frame': !!entityData.frame,
    });
    const attrs = {
      [DocsDataAttributes.TOOL]: true,
    };

    if (resizeChange && url && resizeChange.url === url) {
      // User did resize locally, use the local image size instead.
      // The prevents the image from jumping between the local image size
      // and the saved image size.
      width = resizeChange.width;
      height = resizeChange.height;
    }

    return (
      <span className={className} ref={this._onRef}>
        <span
          {...attrs}
          className="docs-image-body"
          contentEditable={false}>
          <DocsSafeImage
            height={height}
            id={this._imageID}
            onClick={canEdit ? this._onClick : null}
            onError={this._onError}
            onLoad={this._onLoad}
            src={url}
            width={width}
          />
          {resizeHandle}
        </span>
      </span>
    );
  }

  _onRef = (ref: any): void => {
    if (this._container) {
      // Remove old listener.
      ResizeObserver.unobserve(asElement(this._container));
    }
    if (ref) {
      // Register new listener.
      this._container = asElement(ReactDOM.findDOMNode(ref));
      ResizeObserver.observe(this._container, this._onContainerResize);
    }
  };

  _onContainerResize = (info: ResizeObserverEntry): void => {
    const {width, height, url} = this.props.entityData;
    const element = document.getElementById(this._imageID);
    if (element, width, height, url) {
      const image: DOMImage = {
        width: Number(width),
        height: Number(height),
        src: String(url),
        element,
      };
      this._calibrateSize(image);
    }
  };

  _onLoad = (image: DOMImage): void => {
    this.setState({error: false});
    this._calibrateSize(image);
  };

  _calibrateSize = (image: DOMImage): void => {
    const {entityData} = this.props;
    const {src, width, height, element} = image;
    if (src === entityData.url && width && height) {
      // If the displayed image is wider than the maximum width allowed,
      // we'd constraint the width to avoid broken layout.
      const el = nullthrows(element);
      const maxWidth = DocsImageResizeHandle.getMaxResizeWidth(el);
      if (width > maxWidth) {
        const aspectRatio = width / height;
        const newWidth = maxWidth;
        const newHeight = maxWidth / aspectRatio;
        this._onImageResizeEnd(newWidth, newHeight);
      } else if (!entityData.width || !entityData.height) {
        // Save the current loaded size to `entityData`.
        this._onImageResizeEnd(width, height);
      }
    }
  };

  _onError = (): void => {
    this.setState({error: true});
  };

  _onClick = (e: any): void => {
    e.preventDefault();
    this.setState({editing: true});
    const {docsContext} = this.context;
    const {entityData} = this.props;
    this._imageEditorModal = showImageEditorModalDialog(
      docsContext,
      entityData,
      this._onEntityDataChange,
    );
  };

  _onImageResizeEnd = (w: number, h: number): void => {
    const {canEdit} = this.context.docsContext;
    const {entityData, onEntityDataChange} = this.props;
    const newEntityData = setSize(entityData, w, h);
    this.setState({
      resizeChange: newEntityData,
    });
    canEdit && onEntityDataChange(newEntityData);
  };

  _onEntityDataChange = (data: ?ImageEntityData): void => {
    if (this._unmounted) {
      return;
    }
    this.setState({editing: false});
    if (data === undefined) {
      return;
    }
    this.props.onEntityDataChange(data);
  };
}

module.exports = docsWithContext(DocsImage);
