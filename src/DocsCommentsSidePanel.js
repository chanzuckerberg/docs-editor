// @flow

import DocsCommentSideItem from './DocsCommentSideItem';
import DocsContext from './DocsContext';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import commentsManager from './commentsManager';
import createDOMCustomEvent from './createDOMCustomEvent';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {CLASS_NAME} from './DocsComment';
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
    activeCommentThreadId: ?string,
    commentThreadIds: Array<string>,
    editorState: EditorState,
    renderComment: (
      props: {commentThreadId: string, isActive: boolean},
    ) => ?React.Element<any>,
  };

  render(): React.Element<any> {
    const {commentThreadIds, renderComment} = this.props;
    return (
      <div className="docs-comments-side-panel">
        {commentThreadIds.map(this._renderItem)}
      </div>
    );
  }

  _renderItem = (commentThreadId: string): ?React.Element<any> => {
    const {activeCommentThreadId, editorState, renderComment} = this.props;
    return (
      <DocsCommentSideItem
        commentThreadId={commentThreadId}
        editorState={editorState}
        isActive={activeCommentThreadId === commentThreadId}
        key={commentThreadId}
        renderComment={renderComment}
      />
    );
  };
}

class DocsCommentsSidePanel extends React.PureComponent {

  // _eventsCapture = null;
  // _unmounted = false;
  // _timer = new Timer();

  props: Props;

  state = {
    activeCommentThreadId: commentsManager.getActiveCommentThreadId(),
    commentThreadIds: commentsManager.getCommentThreadIds(),
  };

  componentDidMount(): void {
    commentsManager.register('*', this);
  }

  componentWillUnmount(): void {
    commentsManager.unregister('*', this);
  }

  // componentDidMount(): void {
  //   this._timer.set(this._lookupCommentIDs, UPDATE_DELAY);
  // }

  componentWillReceiveProps(nextProps: Props): void {
    const currContent = this.props.editorState.getCurrentContent();
    const nextContent = nextProps.editorState.getCurrentContent();
    // if (currContent !== nextContent) {
    const commentThreadIds = commentsManager.getCommentThreadIds();
    const activeCommentThreadId = commentsManager.getActiveCommentThreadId();
    this.setState({
      activeCommentThreadId: commentsManager.getActiveCommentThreadId(),
      commentThreadIds: commentsManager.getCommentThreadIds(),
    });
    // }
    // this._timer.clear();
    // this._timer.set(this._lookupCommentIDs, UPDATE_DELAY);
  }

  // componentWillUnmount(): void {
  //   this._timer.clear();
  // }

  render(): ?React.Element<any> {
    const docsContext  = this.context && this.context.docsContext;
    const runtime = docsContext && docsContext.runtime;
    const renderComment = runtime && runtime.renderComment;
    if (!renderComment) {
      return null;
    }

    const {activeCommentThreadId, commentThreadIds} = this.state;
    if (!commentThreadIds.length) {
      return null;
    }
    const {editorState} = this.props;
    return (
      <DocsCommentsSidePanelTemplate
        activeCommentThreadId={activeCommentThreadId}
        commentThreadIds={commentThreadIds}
        editorState={editorState}
        renderComment={renderComment}
      />
    );
  }

  // _lookupCommentIDs = (): void => {
  //   const {editorId} = this.props;
  //   const editorEl = document.getElementById(editorId);
  //   if (!editorEl) {
  //     return;
  //   }
  //   const els = editorEl.querySelectorAll('.' + CLASS_NAME);
  //   const commentThreadIds = Array.from(els).reduce((memo, el) => {
  //     const commentThreadId = el.getAttribute(ATTRIBUTE_COMMENT_ID);
  //     if (commentThreadId && memo.indexOf(commentThreadId) === -1) {
  //       memo.push(commentThreadId);
  //     }
  //     return memo;
  //   }, []);
  //
  //   if (
  //     commentThreadIds.length === this.state.commentThreadIds.length &&
  //     commentThreadIds.join(',') === this.state.commentThreadIds.join(',')
  //   ) {
  //     return;
  //   }
  //   this.setState({commentThreadIds});
  // };
}

module.exports = withDocsContext(DocsCommentsSidePanel);
