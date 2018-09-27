// @flow

import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import createDOMCustomEvent from './createDOMCustomEvent';

class DocsCommentSideItem extends React.PureComponent {
  props: {
    commentId: string,
    renderComment: (props: {commentId: string, isActive: boolean}) => ?React.Element<any>,
  };

  _eventsCapture = null;

  state = {
    isActive: false,
  };

  componentDidMount(): void {
    this._listen();
  }

  componentWillUnmount(): void {
    this._unlisten();
  }

  render(): React.Element<any> {
    const {commentId, renderComment} = this.props;
    const {isActive} = this.state;
    return (
      <div className="docs-comment-side-item">
        {renderComment({commentId, isActive})}
      </div>
    );
  }

  _listen(): void {
    if (this._eventsCapture) {
      return;
    }
    this._eventsCapture = captureDocumentEvents({
      [DocsEventTypes.COMMENT_FOCUS_IN]: this._onFocusIn,
      [DocsEventTypes.COMMENT_FOCUS_OUT]: this._onFocusOut,
    });
  }

  _unlisten(): void {
    if (!this._eventsCapture) {
      return;
    }
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = null;
  }

  _onFocusIn = (e: Event): void => {
    if (e.detail && e.detail.commentId === this.props.commentId) {
      this.setState({isActive: true});
    }
  };

  _onFocusOut = (e: Event): void => {
    if (e.detail && e.detail.commentId === this.props.commentId) {
      this.setState({isActive: false});
    }
  };
}

export default DocsCommentSideItem;
