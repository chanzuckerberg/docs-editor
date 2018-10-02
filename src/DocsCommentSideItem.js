// @flow

import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import commentsManager from './commentsManager';
import createDOMCustomEvent from './createDOMCustomEvent';
import lookupElementByAttribute from './lookupElementByAttribute';
import uniqueID from './uniqueID';
import {ATTRIBUTE_COMMENT_ACTIVE, ATTRIBUTE_COMMENT_ID} from './commentsManager';
import {EditorState} from 'draft-js';

import './DocsCommentSideItem.css';

class DocsCommentSideItem extends React.Component {

  props: {
    commentThreadId: string,
    editorState: EditorState,
    isActive: boolean,
    renderComment: (
      props: {commentThreadId: string, isActive: boolean},
    ) => ?React.Element<any>,
  };

  _id = uniqueID();
  _style = null;

  componentDidMount(): void {
    commentsManager.register('*', this);
  }

  componentWillUnmount(): void {
    commentsManager.unregister('*', this);
  }

  render(): React.Element<any> {
    const {isActive, commentThreadId, renderComment} = this.props;
    return (
      <div
        id={this._id}
        className="docs-comment-side-item"
        style={this._style}>
        {renderComment({commentThreadId, isActive})}
      </div>
    );
  }

  // _onClick = (): void => {
  //   setTimeout(() => {
  //     const {commentThreadId} = this.props;
  //     commentsManager.activate(commentThreadId);
  //   }, 800);
  // };

  componentDidMount(): void {
    this._syncPosition();
  }

  componentDidUpdate(): void {
    this._syncPosition();
  }

  _syncPosition(): void {
    const {commentThreadId} = this.props;
    const el = document.getElementById(this._id);
    if (!el) {
      return;
    }
    const scrollEl = lookupElementByAttribute(
      el,
      'className',
      'docs-editor-frame-body-scroll',
    );

    if (!scrollEl) {
      return;
    }

    const commentEls = Array.from(document.getElementsByName(commentThreadId));
    const firstCommentEl = commentEls[0];
    if (!firstCommentEl) {
      return;
    }
    const scrollRect = scrollEl.getBoundingClientRect();
    const commentRect = firstCommentEl.getBoundingClientRect();
    const top = commentRect.top - scrollRect.top + scrollEl.scrollTop;
    const cssTransform = `translate3d(0, ${top}px, 0)`;
    el.style.transform = cssTransform;
    // el.style.transition = 'all 350ms';
    this._style = {
      ...this._style,
      transform: cssTransform,
      transition: 'all 350ms',
    };
  }

  // _listen(): void {
  //   if (this._eventsCapture) {
  //     return;
  //   }
  //   this._eventsCapture = captureDocumentEvents({
  //     [DocsEventTypes.COMMENT_FOCUS_IN]: this._onFocusIn,
  //     [DocsEventTypes.COMMENT_FOCUS_OUT]: this._onFocusOut,
  //   });
  // }
  //
  // _unlisten(): void {
  //   if (!this._eventsCapture) {
  //     return;
  //   }
  //   this._eventsCapture && this._eventsCapture.dispose();
  //   this._eventsCapture = null;
  // }
  //
  // _onFocusIn = (e: Event): void => {
  //   if (e.detail && e.detail.commentThreadId === this.props.commentThreadId) {
  //     this.setState({isActive: true});
  //   }
  // };
  //
  // _onFocusOut = (e: Event): void => {
  //   if (e.detail && e.detail.commentThreadId === this.props.commentThreadId) {
  //     this.setState({isActive: false});
  //   }
  // };
}

export default DocsCommentSideItem;
