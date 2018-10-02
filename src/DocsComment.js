// @flow

import DocsContext from './DocsContext';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import commentsManager from './commentsManager';
import createDOMCustomEvent from './createDOMCustomEvent';
import cx from 'classnames';
import getCurrentSelectionEntity from './getCurrentSelectionEntity';
import getDOMSelectionNode from './getDOMSelectionNode';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {ATTRIBUTE_COMMENT_ACTIVE, ATTRIBUTE_COMMENT_ID} from './commentsManager';
import {EditorState, Modifier, Entity} from 'draft-js';

import type {DocsCommentEntityData} from './Types';

import './DocsComment.css';

type Props = {
  children?: any,
  entityData: DocsCommentEntityData,
};

export const CLASS_NAME = 'docs-comment';

function getCommentThreadId(props: Props): string {
  const {commentThreadId} = props.entityData;
  return commentThreadId;
}

// This component for commented text.
class DocsComment extends React.PureComponent {

  _eventsCapture = null;
  _id = uniqueID();
  _timer = new Timer();
  _unmounted = false;

  state = {
    commentThreadId: getCommentThreadId(this.props),
  };

  props: Props;

  componentWillMount(): void {
    commentsManager.register(this.state.commentThreadId, this);
  }

  componentDidMount(): void {
    this._checkActiveState();
    this._listen();
  }

  componentWillUnmount(): void {
    commentsManager.unregister(this.state.commentThreadId, this);
    this._unmounted = true;
    this._timer.clear();
    this._unlisten();
  }

  render(): React.Element<any> {
    const {children} = this.props;
    const {commentThreadId} = this.state;
    const attrs = {[ATTRIBUTE_COMMENT_ID]: commentThreadId};
    return (
      <span
        {...attrs}
        name={commentThreadId}
        className={CLASS_NAME}
        id={this._id}>
        {children}
      </span>
    );
  }

  _getCommentThreadId(): string {
    const {entityData} = this.props;
    const {commentThreadId} = entityData;
    return commentThreadId;
  }

  _listen(): void {
    if (this._eventsCapture || this._unmounted) {
      return;
    }
    this._eventsCapture = captureDocumentEvents({
      'keydown': this._checkActiveState,
      'mousedown': this._checkActiveState,
    });
  }

  _unlisten(): void {
    if (!this._eventsCapture) {
      return;
    }
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = null;
  }

  _checkActiveState = (): void => {
    this._timer.clear();
    this._timer.set(this._syncActiveState);
  }

  _syncActiveState = (): void => {
    const el = document.getElementById(this._id);
    if (!el) {
      return;
    }
    const selectionNode = getDOMSelectionNode();
    const active = selectionNode === el || el.contains(selectionNode);
    const commentThreadId = String(el.getAttribute(ATTRIBUTE_COMMENT_ID));
    if (active) {
      commentsManager.activate(commentThreadId);
    } else {
      commentsManager.deactivate(commentThreadId);
    }
  };

  // _onRequestFocus = (e: any): void => {
  //   if (
  //     e.detail &&
  //     e.detail.commentThreadId === this.props.entityData.commentThreadId
  //   ) {
  //     this._setActive(true);
  //   }
  // };
  //
  // _setActive(active: boolean): void {
  //   if (active === this._active) {
  //     return;
  //   }
  //
  //   const el = document.getElementById(this._id);
  //   if (!el) {
  //     return;
  //   }
  //
  //   this._active = active;
  //   if (active) {
  //     el.setAttribute(ATTRIBUTE_COMMENT_ACTIVE, "true");
  //   } else {
  //     el.removeAttribute(ATTRIBUTE_COMMENT_ACTIVE);
  //   }
  //
  //   // Notify the document that the comment is focused, so that we could
  //   // update the related comment panels.
  //   const {commentThreadId} = this.props.entityData;
  //
  //   const detail = {
  //     target: el,
  //     commentThreadId,
  //   };
  //
  //   const event = createDOMCustomEvent(
  //     active ?
  //       DocsEventTypes.COMMENT_FOCUS_IN :
  //       DocsEventTypes.COMMENT_FOCUS_OUT,
  //     true,
  //     true,
  //     detail,
  //   );
  //
  //   el.dispatchEvent(event);
  // }
}

export default withDocsContext(DocsComment);
