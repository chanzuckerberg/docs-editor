// @flow

import React from 'react';
import cx from 'classnames';

import './DemoComment.css';

class DemoComment extends React.PureComponent {

  props: {
    commentThreadId: string,
    isActive: boolean,
  };

  render(): React.Element<any> {
    const {commentThreadId, isActive} = this.props;
    const className = cx('demo-comment', {'active': isActive});
    return (
      <div className={className}>
        {commentThreadId}
        <br />
        {String(isActive)}
      </div>
    );
  }
}

export default DemoComment;
