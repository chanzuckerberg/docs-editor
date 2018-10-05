// @flow

import DocsCommentSideItem from './DocsCommentSideItem';
import DocsContext from './DocsContext';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import commentsManager from './commentsManager';
import lookupElementByAttribute from './lookupElementByAttribute';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {ATTRIBUTE_COMMENT_ACTIVE, ATTRIBUTE_COMMENT_THREAD_ID, ATTRIBUTE_COMMENT_USE_TRANSITION} from './commentsManager';
import {CLASS_NAME} from './DocsComment';
import {EditorState} from 'draft-js';

import type {DocsCommentEntityData} from './Types';

import './DocsCommentsSidePanel.css';

type Rect = {
  height: number,
  left: number,
  top: number,
};

type Box = {
  active: boolean,
  activeTop: number,
  commentThreadId: string,
  height: number,
  left: number,
  target: Element,
  targetRect: Rect,
  top: number,
  view: Element,
  viewRect: Rect,
};

const UPDATE_DELAY = 500;

type Props = {
  editorId: string,
  editorState: EditorState,
};

function sortBoxes(one: Box, two: Box): number {
  const t1 = one.top;
  const t2 = two.top;
  if (t1 > t2) {
    return 1;
  } else if (t2 > t1) {
    return -1;
  } else {
    return one.left >= two.left ? 1 : -1;
  }
}

function getSideItemElementBoxes(root: Element): Array<Box> {
  return Array
    .from(root.querySelectorAll(`div[${ATTRIBUTE_COMMENT_THREAD_ID}]`))
    .map(view => {
      const commentThreadId = view.getAttribute(ATTRIBUTE_COMMENT_THREAD_ID);
      if (!commentThreadId) {
        return null;
      }
      const commentEls = document.getElementsByName(String(commentThreadId));
      const target = commentEls[0];
      if (!target) {
        return null;
      }
      const targetRect = target.getBoundingClientRect();
      const viewRect = view.getBoundingClientRect();

      return {
        active: commentsManager.getActiveCommentThreadId() === commentThreadId,
        activeTop: 0,
        commentThreadId,
        height: viewRect.height,
        left: targetRect.left,
        top: 0,
        rect: {
          top: 0,
          height: 0,
          left: 0,
        },
        view,
        viewRect: {
          top: viewRect.top,
          height: viewRect.height,
          left: 0,
        },
        target,
        targetRect: {
          height: targetRect.height,
          left: targetRect.left,
          top: targetRect.top,
        }
      };
    })
    .filter(Boolean);
}

function updateSideItemElementPositions(root: Element): void {
  const scrollEl = lookupElementByAttribute(
    root,
    'className',
    'docs-editor-frame-body-scroll',
  );

  if (!scrollEl) {
    return;
  }
  const scrollRect = scrollEl.getBoundingClientRect();
  const scrollTop = scrollEl.scrollTop - scrollRect.top;
  const boxes = getSideItemElementBoxes(root);
  let activeBox = null;

  // Sets initial value.
  boxes.forEach(box => {
    box.height = box.viewRect.height;
    box.left = box.targetRect.left;
    box.top = box.targetRect.top + scrollTop;
    activeBox = (box.active && !activeBox) ? box : activeBox;
  });

  boxes.sort(sortBoxes);

  // Ensure boxes don't overlap.
  boxes.forEach((box, ii) => {
    const prevBox = boxes[ii - 1];
    if (!prevBox) {
      return;
    }
    const overflow = prevBox.top + prevBox.height - box.top;
    if (overflow > 0) {
      box.top += overflow;
    }
  });

  // Move the active box to visible location.
  boxes.some((box, ii) => {
    if (!box.active) {
      return;
    }

    const newTop = box.targetRect.top + scrollTop;
    const delta = newTop - box.top;
    if (delta >= 0) {
      return true;
    }
    box.top = newTop;
    boxes.forEach((anotherBox, jj) => {
      if (anotherBox !== box) {
        anotherBox.top += delta;
      }
    });
    return true;
  });

  boxes.forEach((box, ii) => {
    const el: any = box.view;
    const top = box.top;
    const left = box.active ? -10 : 0;
    const style = el.style;
    if (!style) {
      return;
    }
    const nextStyle: Object = {
      transform: `translate3d(${left}px, ${Math.round(top)}px, 0)`,
      zIndex: box.active ? 2 : 1,
    };
    if (style.transform && !el.hasAttribute(ATTRIBUTE_COMMENT_USE_TRANSITION)) {
      el.setAttribute(ATTRIBUTE_COMMENT_USE_TRANSITION, 'y');
    }
    Object.assign(style, nextStyle);
  });

  if (!activeBox) {
    return;
  }

  try {
    const {target} = activeBox;
    if (target.scrollIntoViewIfNeeded) {
      target.scrollIntoViewIfNeeded(true);
    } else if  (target.scrollIntoView) {
      target.scrollIntoView('smooth');
    }
  } catch (ex) {
    // skip
  }
}

class DocsCommentsSidePanelTemplate extends React.PureComponent {

  _rid = 0;
  _id = uniqueID();

  props: {
    activeCommentThreadId: ?string,
    commentThreadIds: Array<string>,
    renderComment: (
      props: {commentThreadId: string, isActive: boolean},
    ) => ?React.Element<any>,
  };

  componentWillUnmount(): void {
    this._rid && window.cancelAnimationFrame(this._rid);
  }

  render(): React.Element<any> {
    const {commentThreadIds, renderComment} = this.props;
    return (
      <div className="docs-comments-side-panel" id={this._id}>
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
        onRequestCommentThreadReflow={this._syncPosition}
        renderComment={renderComment}
      />
    );
  };

  _syncPosition = (): void => {
    window.cancelAnimationFrame(this._rid);
    this._rid = window.requestAnimationFrame(this._syncPositionImmediate);
  };

  _syncPositionImmediate = (): void => {
    const el = document.getElementById(this._id);
    if (el) {
      updateSideItemElementPositions(el);
    }
  };
}

class DocsCommentsSidePanel extends React.PureComponent {

  props: Props;

  state = {
    activeCommentThreadId: commentsManager.getActiveCommentThreadId(),
    commentThreadIds: commentsManager.getCommentThreadIds(),
  };

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
