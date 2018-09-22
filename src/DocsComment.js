// @flow

import DocsContext from './DocsContext';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import createDOMCustomEvent from './createDOMCustomEvent';
import cx from 'classnames';
import getCurrentSelectionEntity from './getCurrentSelectionEntity';
import getDOMSelectionNode from './getDOMSelectionNode';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {EditorState, Modifier, Entity} from 'draft-js';

import type {DocsCommentEntityData} from './Types';

import './DocsComment.css';

type Props = {
  children?: any,
  entityData: DocsCommentEntityData,
};

export const ATTRIBUTE_COMMENT_ACTIVE = 'data-docs-comment-active';
export const ATTRIBUTE_COMMENT_ID = 'data-docs-comment-id';
export const CLASS_NAME = 'docs-comment';

// This component for commented text.
class DocsComment extends React.PureComponent {

  _id = uniqueID();
  _active = false;
  _eventsCapture = null;
  _unmounted = false;
  _timer = new Timer();

  props: Props;

  componentDidMount(): void {
    this._listen();
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    this._timer.clear();
    this._unlisten();
  }

  render(): React.Element<any> {
    const {children, entityData} = this.props;
    const {commentId} = entityData;
    const attrs = {[ATTRIBUTE_COMMENT_ID]: commentId};
    return (
      <span
        {...attrs}
        name={commentId}
        className={CLASS_NAME}
        id={this._id}>
        {children}
      </span>
    );
  }

  _listen(): void {
    if (this._eventsCapture || this._unmounted) {
      return;
    }
    this._eventsCapture = captureDocumentEvents({
      'keyup': this._checkActiveState,
      'click': this._checkActiveState,
      [DocsEventTypes.COMMENT_REQUEST_FOCUS]: this._onRequestFocus,
    });
  }

  _unlisten(): void {
    if (!this._eventsCapture) {
      return;
    }
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = null;
  }

  _checkActiveState = (e: Event): void => {
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
    this._setActive(active);
  };

  _onRequestFocus = (e: any): void => {
    if (
      e.detail &&
      e.detail.commentId === this.props.entityData.commentId
    ) {
      this._setActive(true);
    }
  };

  _setActive(active: boolean): void {
    if (active === this._active) {
      return;
    }

    const el = document.getElementById(this._id);
    if (!el) {
      return;
    }

    this._active = active;
    if (active) {
      el.setAttribute(ATTRIBUTE_COMMENT_ACTIVE, "true");
    } else {
      el.removeAttribute(ATTRIBUTE_COMMENT_ACTIVE);
    }

    // Notify the document that the comment is focused, so that we could
    // update the related comment panels.
    const {commentId} = this.props.entityData;

    const detail = {
      target: el,
      commentId,
    };

    const event = createDOMCustomEvent(
      active ?
        DocsEventTypes.COMMENT_FOCUS_IN :
        DocsEventTypes.COMMENT_FOCUS_OUT,
      true,
      true,
      detail,
    );

    el.dispatchEvent(event);
  }
}

export default withDocsContext(DocsComment);
