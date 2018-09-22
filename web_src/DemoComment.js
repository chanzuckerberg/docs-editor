// @flow

import React from 'react';
import cx from 'classnames';

import './DemoComment.css';

class DemoComment extends React.PureComponent {

  props: {
    commentId: string,
    isActive: boolean,
  };

  render(): React.Element<any> {
    const {commentId, isActive} = this.props;
    const className = cx('demo-comment', {'active': isActive});
    return (
      <div className={className}>
        {commentId}
        <br />
        {String(isActive)}
      </div>
    );
  }
}

export default DemoComment;
