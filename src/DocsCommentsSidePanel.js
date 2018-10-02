// @flow

import DocsCommentSideItem from './DocsCommentSideItem';
import DocsContext from './DocsContext';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import commentsManager from './commentsManager';
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
    const {activeCommentThreadId, renderComment} = this.props;
    return (
      <DocsCommentSideItem
        commentThreadId={commentThreadId}
        key={commentThreadId}
        renderComment={renderComment}
      />
    );
  };
}

class DocsCommentsSidePanel extends React.PureComponent {

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


  componentWillReceiveProps(nextProps: Props): void {
    const currContent = this.props.editorState.getCurrentContent();
    const nextContent = nextProps.editorState.getCurrentContent();
    if (currContent !== nextContent) {
      const commentThreadIds = commentsManager.getCommentThreadIds();
      const activeCommentThreadId = commentsManager.getActiveCommentThreadId();
      this.setState({
        activeCommentThreadId: commentsManager.getActiveCommentThreadId(),
        commentThreadIds: commentsManager.getCommentThreadIds(),
      });
    }
    commentsManager.setEditorState(nextProps.editorState);
  }

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
        renderComment={renderComment}
      />
    );
  }
}

module.exports = withDocsContext(DocsCommentsSidePanel);
