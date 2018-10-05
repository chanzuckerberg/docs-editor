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

import type {RenderCommentCall} from './Types';

class DocsCommentSideItem extends React.PureComponent {

  props: {
    commentThreadId: string,
    onRequestCommentThreadReflow: (commentThreadId: string) => void,
    renderComment: RenderCommentCall,
  };

  state = {
    active:
      this.props.commentThreadId === commentsManager.getActiveCommentThreadId(),
  };

  _id = uniqueID();

  _style = null;

  componentDidMount(): void {
    commentsManager.observe(this._onObserve);
    this._requestCommentThreadReflow();
  }

  componentWillUnmount(): void {
    commentsManager.unobserve(this._onObserve);
  }

  render(): React.Element<any> {
    const {commentThreadId, renderComment} = this.props;
    const isActive = this.state.active;
    const attrs = {[ATTRIBUTE_COMMENT_THREAD_ID]: commentThreadId};
    const childProps = {
      commentThreadId,
      isActive,
      requestCommentThreadDeletion: this._requestCommentThreadDeletion,
      requestCommentThreadReflow: this._requestCommentThreadReflow,
    };
    return (
      <div
        {...attrs}
        id={this._id}
        className="docs-comment-side-item"
        style={this._style}>
        {renderComment(childProps)}
      </div>
    );
  }

  _requestCommentThreadReflow = (): void => {
    this.props.onRequestCommentThreadReflow(this.props.commentThreadId);
  };

  _requestCommentThreadDeletion = (): void => {
    const el = document.getElementById(this._id);
    if (el) {
      // TODO: This seems hacky.
      // A workaround to clear selection from editor.
      el.setAttribute('tabindex', '0');
      el.focus();
      commentsManager.requestCommentThreadDeletion(this.props.commentThreadId);
    }
  };

  _onObserve = (info: Object): void => {
    const {type, commentThreadId} = info;
    if (type === DocsEventTypes.COMMENT_CHANGE) {
      const {active} = this.state;
      const val = this.props.commentThreadId === commentThreadId;
      if (val !== active) {
        this.setState({active: val});
      }
    }
    this._requestCommentThreadReflow();
  };
}

export default DocsCommentSideItem;
