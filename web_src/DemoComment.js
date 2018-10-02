// @flow

import React from 'react';
import cx from 'classnames';

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
          <button onMouseDown={this._onMouseDown}>x</button>
        </div>
        {commentThreadId}
        <br />
        {String(isActive)}
      </div>
    );
  }

  _onMouseDown = (e: SyntheticEvent): void => {
    e.preventDefault();
    this.props.onDismiss();
  };
}

export default DemoComment;
