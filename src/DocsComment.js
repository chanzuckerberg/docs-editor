// @flow

import DocsContext from './DocsContext';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
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

const ATTRIBUTE_ACTIVE = 'data-docs-comment-active';

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
    const {clientID} = entityData;

    const className = cx({
      'docs-comment': true,
    });

    return (
      <span
        className={className}
        data-docs-comment-client-id={clientID}
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
    if (active === this._active) {
      return;
    }
    this._active = active;
    if (active) {
      el.setAttribute(ATTRIBUTE_ACTIVE, "true");
    } else {
      el.removeAttribute(ATTRIBUTE_ACTIVE);
    }
  };
}

module.exports = withDocsContext(DocsComment);
