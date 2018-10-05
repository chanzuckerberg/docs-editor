// @flow

import React from 'react';
import cx from 'classnames';
import DocsButton from '../src/DocsButton';

import './DemoComment.css';

import type {RenderCommentProps} from '../src/Types';

const comments = new Map();

class DemoComment extends React.PureComponent {

  props: RenderCommentProps;

  render(): React.Element<any> {
    const {commentThreadId, isActive} = this.props;
    const className = cx('demo-comment', {'active': isActive});
    const defaultValue = comments.has(commentThreadId) ?
      comments.get(commentThreadId) :
      'Write something';
    return (
      <div className={className}>
        <div className="demo-comment-button">
          <span>{commentThreadId.substr(-20)}...</span>
          <DocsButton
            label="X"
            onClick={this._onClick}
          />
        </div>
        <textarea
          defaultValue={defaultValue}
          className="demo-comment-textarea" onChange={this._onChange}>
        </textarea>
      </div>
    );
  }

  _onChange = (e: SyntheticInputEvent): void => {
    const {commentThreadId, isActive} = this.props;
    comments.set(commentThreadId, e.target.value);
  }

  _onClick = (): void => {
    this.props.requestCommentThreadDeletion();
  };
}

export default DemoComment;
