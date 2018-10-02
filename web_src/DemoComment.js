// @flow

import React from 'react';
import cx from 'classnames';
import DocsButton from '../src/DocsButton';

import './DemoComment.css';

class DemoComment extends React.PureComponent {

  props: {
    commentThreadId: string,
    isActive: boolean,
    onDismiss: Function,
  };

  render(): React.Element<any> {
    const {commentThreadId, isActive} = this.props;
    const className = cx('demo-comment', {'active': isActive});
    return (
      <div className={className}>
        <div className="demo-comment-button">
          <DocsButton
            label="X"
            onClick={this._onClick}
          />
        </div>
        {commentThreadId}
        <br />
        {String(isActive)}
      </div>
    );
  }

  _onClick = (): void => {
    this.props.onDismiss();
  };
}

export default DemoComment;
