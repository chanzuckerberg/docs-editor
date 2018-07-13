// @flow

import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import cx from 'classnames';
import docsWithContext from './docsWithContext';

type Props = {
  imageID: string,
  onImageResizeEnd: (w: number, h: number) => void,
};

// Get the maxWidth that the image could be resized to.
function getMaxResizeWidth(el: any): number {
  // Ideally, the image should bot be wider then its containing element.
  let node: any = el.parentNode;
  while (node && !node.offsetParent) {
    node = node.parentNode;
  }
  if (
    node &&
    node.offsetParent &&
    node.offsetParent.offsetWidth &&
    node.offsetParent.offsetWidth > 0
  ) {
    return node.offsetParent.offsetWidth;
  }
  // Let the image resize freely.
  return 100000000;
}


class DocsImageResizeHandle extends React.PureComponent {

  static getMaxResizeWidth = getMaxResizeWidth;

  _resizeContext = null;
  _eventsCapture = null;
  _timer = new Timer();

  props: Props;

  componentWillUnmount(): void {
    this._timer.dispose();
    this._eventsCapture && this._eventsCapture.dispose();
  }

  render(): ?React.Element<any> {
    if (!this.context.docsContext.canEdit) {
      return null;
    }
    const className = cx({
      'docs-image-resize-handle': true,
    });

    return (
      <span
        className={className}
        data-docs-tool="true"
        onMouseDown={this._onMouseDown}
        title="Resize image"
      />
    );
  }

  _onMouseDown = (e: any): void => {
    if (this._resizeContext) {
      // Already dragging.
      return;
    }
    const {imageID} = this.props;
    const img = document.getElementById(imageID);
    if (!img) {
      return;
    }
    this._blockEvent(e);

    const maxWidth = getMaxResizeWidth(img);

    const y0 = e.clientY;
    const domRect = img.getBoundingClientRect();
    const rect = {
      width: domRect.width,
      height: domRect.height,
    };
    this._resizeContext = {
      aspectRatio: rect.width / rect.height,
      cssText: img.style.cssText,
      maxWidth,
      img,
      h: 0,
      rect,
      w: 0,
      y0,
    };
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = captureDocumentEvents({
      mousemove: this._onMouseMove,
      mouseup: this._onMouseUp,
    });
  };

  _onMouseMove = (e: any): void => {
    this._blockEvent(e);
    const resizeContext = this._resizeContext;
    if (!resizeContext) {
      return;
    }
    const {y0, rect, aspectRatio, maxWidth} = resizeContext;
    const y1 = e.clientY;
    const dy = y1 - y0;
    let h = Math.max(60, rect.height + dy);
    let w = aspectRatio * h;
    if (w > maxWidth) {
      w = maxWidth;
      h = w / aspectRatio;
    }
    w = Math.round(w);
    h = Math.round(h);
    this._resizeContext = {
      ...resizeContext,
      h,
      w,
    };
    this._timer.set(this._applyResizeStyle);
  };


  _onMouseUp = (e: any): void => {
    this._timer.clear();
    this._blockEvent(e);
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = null;

    const resizeContext = this._resizeContext;
    this._resizeContext = null;
    if (!resizeContext) {
      return;
    }
    this._resizeContext = null;
    const {img, w, h, cssText} = resizeContext;

    if (!w || !h) {
      return;
    }

    // Resume styles.
    img.style.cssText = cssText;
    this.props.onImageResizeEnd(w, h);
  };

  _applyResizeStyle = (): void => {
    const resizeContext = this._resizeContext;
    if (!resizeContext) {
      return;
    }
    const {w, h, img} = resizeContext;
    if (!w || !h) {
      return;
    }
    img.style.width = w + 'px';
    img.style.height = h + 'px';
  };

  _blockEvent(e: any): void {
    e.preventDefault();
    e.stopPropagation();
  }
}

module.exports = docsWithContext(DocsImageResizeHandle);
