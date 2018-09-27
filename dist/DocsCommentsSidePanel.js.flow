// @flow

import DocsCommentSideItem from './DocsCommentSideItem';
import DocsContext from './DocsContext';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import createDOMCustomEvent from './createDOMCustomEvent';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {ATTRIBUTE_COMMENT_ID, CLASS_NAME} from './DocsComment';
import {EditorState} from 'draft-js';

import type {DocsCommentEntityData} from './Types';

import './DocsCommentsSidePanel.css';

const UPDATE_DELAY = 500;

type Props = {
  editorId: string,
  editorState: EditorState,
};

class DocsCommentsSidePanelTemplate extends React.PureComponent {
  props: {
    commentIds: Array<string>,
    renderComment: (props: {commentId: string, isActive: boolean}) => ?React.Element<any>,
  };

  render(): React.Element<any> {
    const {commentIds, renderComment} = this.props;
    return (
      <div className="docs-comments-side-panel">
        {commentIds.map(this._renderItem)}
      </div>
    );
  }

  _renderItem = (commentId: string): React.Element<any> => {
    const {renderComment} = this.props;
    return (
      <DocsCommentSideItem
        commentId={commentId}
        key={commentId}
        renderComment={renderComment}
      />
    );
  };
}

class DocsCommentsSidePanel extends React.PureComponent {

  _eventsCapture = null;
  _unmounted = false;
  _timer = new Timer();

  props: Props;

  state = {
    commentIds: [],
  };

  componentDidMount(): void {
    this._timer.set(this._lookupCommentIDs, UPDATE_DELAY);
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      prevProps.editorState.getCurrentContent() ===
      this.props.editorState.getCurrentContent()
    ) {
      return;
    }
    this._timer.clear();
    this._timer.set(this._lookupCommentIDs, UPDATE_DELAY);
  }

  componentWillUnmount(): void {
    this._timer.clear();
  }

  render(): ?React.Element<any> {
    const docsContext  = this.context && this.context.docsContext;
    const runtime = docsContext && docsContext.runtime;
    const renderComment = runtime && runtime.renderComment;
    if (!renderComment) {
      return null;
    }
    const {commentIds} = this.state;
    if (!commentIds.length) {
      return null;
    }
    return (
      <DocsCommentsSidePanelTemplate
        commentIds={commentIds}
        renderComment={renderComment}
      />
    );
  }

  _lookupCommentIDs = (): void => {
    const {editorId} = this.props;
    const editorEl = document.getElementById(editorId);
    if (!editorEl) {
      return;
    }
    const els = editorEl.querySelectorAll('.' + CLASS_NAME);
    const commentIds = Array.from(els).reduce((memo, el) => {
      const commentId = el.getAttribute(ATTRIBUTE_COMMENT_ID);
      if (commentId && memo.indexOf(commentId) === -1) {
        memo.push(commentId);
      }
      return memo;
    }, []);

    if (
      commentIds.length === this.state.commentIds.length &&
      commentIds.join(',') === this.state.commentIds.join(',')
    ) {
      return;
    }
    this.setState({commentIds});
  };
}

module.exports = withDocsContext(DocsCommentsSidePanel);
