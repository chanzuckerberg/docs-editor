// @flow

import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import commentsManager from './commentsManager';
import createDOMCustomEvent from './createDOMCustomEvent';
import lookupElementByAttribute from './lookupElementByAttribute';
import uniqueID from './uniqueID';
import {ATTRIBUTE_COMMENT_ACTIVE, ATTRIBUTE_COMMENT_THREAD_ID} from './commentsManager';
import {EditorState} from 'draft-js';

import './DocsCommentSideItem.css';

class DocsCommentSideItem extends React.PureComponent {

  props: {
    commentThreadId: string,
    renderComment: (
      props: {commentThreadId: string, isActive: boolean},
    ) => ?React.Element<any>,
  };

  state = {
    active:
      this.props.commentThreadId === commentsManager.getActiveCommentThreadId(),
  };

  _id = uniqueID();
  _rid = 0;

  _style = null;

  componentDidMount(): void {
    commentsManager.observe(this._onObserve);
    this._syncPosition();
  }

  componentWillUnmount(): void {
    commentsManager.unobserve(this._onObserve)
  }

  render(): React.Element<any> {
    const {commentThreadId, renderComment} = this.props;
    const isActive = this.state.active;
    const attrs = {[ATTRIBUTE_COMMENT_THREAD_ID]: commentThreadId};
    return (
      <div
        {...attrs}
        id={this._id}
        className="docs-comment-side-item"
        style={this._style}>
        {renderComment({commentThreadId, isActive})}
      </div>
    );
  }

  _onObserve = (): void => {
    const {commentThreadId} = this.props;
    const {active} = this.state;
    const val = commentThreadId === commentsManager.getActiveCommentThreadId();
    if (val !== active) {
      this.setState({active: val});
    }
    this._syncPosition();
  };

  _syncPosition(): void {
    window.cancelAnimationFrame(this._rid);
    this._rid = window.requestAnimationFrame(this._syncPositionImmediate);
  }

  _syncPositionImmediate = (): void => {
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
    const nextStyle = {
      ...this._style,
      backfaceVisibility: 'hidden',
      transform: cssTransform,
    };

    Object.assign(el.style, nextStyle);

    // The second-time transtion will have animation.
    Object.assign(nextStyle, {
      transitionProperty: 'trasnform',
      transitionDuration: '250ms',
      transitionTimingFunction: 'ease-in',
    });

    this._style = nextStyle;
  };
}

export default DocsCommentSideItem;
