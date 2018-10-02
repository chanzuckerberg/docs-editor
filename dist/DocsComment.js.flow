// @flow

import DocsContext from './DocsContext';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import commentsManager from './commentsManager';
import createDOMCustomEvent from './createDOMCustomEvent';
import cx from 'classnames';
import getCurrentSelectionEntity from './getCurrentSelectionEntity';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {ATTRIBUTE_COMMENT_ACTIVE, ATTRIBUTE_COMMENT_THREAD_ID} from './commentsManager';
import {EditorState, Modifier, Entity} from 'draft-js';

import type {DocsCommentEntityData} from './Types';

import './DocsComment.css';

type Props = {
  children?: any,
  entityData: DocsCommentEntityData,
  onEntityDataChange: (data: ?DocsCommentEntityData) => void,
};

export const CLASS_NAME = 'docs-comment';

function getCommentThreadId(props: Props): string {
  const {commentThreadId} = props.entityData;
  return commentThreadId;
}

// This component for commented text.
class DocsComment extends React.PureComponent {

  _id = uniqueID();

  state = {
    active: false,
    commentThreadId: getCommentThreadId(this.props),
  };

  props: Props;

  componentWillMount(): void {
    commentsManager.registerCommentElement(this.state.commentThreadId, this);
    commentsManager.observe(this._onObserve);
  }

  componentWillUnmount(): void {
    commentsManager.unregisterCommentElement(this.state.commentThreadId, this);
    commentsManager.unobserve(this._onObserve);
  }

  render(): React.Element<any> {
    const {children} = this.props;
    const {active, commentThreadId} = this.state;
    if (!commentThreadId) {
      return (
        <span>
          {children}
        </span>
      );
    }
    const attrs = active ?
    {
      [ATTRIBUTE_COMMENT_ACTIVE]: 'true',
      [ATTRIBUTE_COMMENT_THREAD_ID]: commentThreadId,
    } :
    {
      [ATTRIBUTE_COMMENT_THREAD_ID]: commentThreadId,
    };
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

  _onObserve = (info: Object): void => {
    const {type, commentThreadId} = info;
    if (type === DocsEventTypes.COMMENT_CHANGE) {
      const {active} = this.state;
      const val = this.state.commentThreadId === commentThreadId;
      if (val !== active) {
        this.setState({active: val});
      }
    }
  };
}

export default withDocsContext(DocsComment);
