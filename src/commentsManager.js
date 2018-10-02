// @flow

import invariant from 'invariant';

import type {DocsCommentElement} from './Types';

export const ATTRIBUTE_COMMENT_ACTIVE = 'data-docs-comment-active';
export const ATTRIBUTE_COMMENT_ID = 'data-docs-comment-id';

function activate(commentThreadId: string): boolean {
  const els = document.getElementsByName(commentThreadId);
  Array.from(els).forEach(el => {
    el.setAttribute(ATTRIBUTE_COMMENT_ACTIVE, 'true');
  });
  return els.length > 0;
}

function deactivate(commentThreadId: string): boolean {
  const els = document.getElementsByName(commentThreadId);
  Array.from(els).forEach(el => {
    el.removeAttribute(ATTRIBUTE_COMMENT_ACTIVE);
  });
  return els.length > 0;
}

class DocsCommentsManager {

  _activeCommentThreadId: ?string;
  _entries: Map<string, Set<DocsCommentElement>>;

  constructor() {
    this._activeCommentThreadId = null;
    this._entries = new Map();
  }

  activate(commentThreadId: string): void {
    if (this._activeCommentThreadId === commentThreadId) {
      // Already focused.
      return;
    }

    if (this._activeCommentThreadId) {
      // deactivate old ones.
      deactivate(this._activeCommentThreadId);
    }

    this._activeCommentThreadId = activate(commentThreadId) ?
      commentThreadId :
      null;

    const views: any = this._entries.get('*');
    if (views) {
      Array.from(views).forEach(v => v.forceUpdate());
    }
  }

  deactivate(commentThreadId: string): void {
    if (this._activeCommentThreadId === commentThreadId) {
      deactivate(commentThreadId);
      this._activeCommentThreadId = null;
      const views: any = this._entries.get('*');
      if (views) {
        Array.from(views).forEach(v => v.forceUpdate());
      }
    }
  }

  getActiveCommentThreadId(): ?string {
    return this._activeCommentThreadId;
  }

  getCommentThreadIds(): Array<string> {
    const ids = [];
    this._entries.forEach((components, commentThreadId) => {
      if (commentThreadId && commentThreadId !== '*') {
        components.size && ids.push(commentThreadId);
      }
    });
    return ids;
  }

  register(commentThreadId: string, component: Object): void {
    const components = this._entries.get(commentThreadId) || new Set();
    invariant(!components.has(component), 'already registered');
    components.add(component);
    this._entries.set(commentThreadId, components);
  }

  unregister(commentThreadId: string, component: Object): void {
    const components = this._entries.get(commentThreadId);
    invariant(
      components && components.has(component),
      'not registered',
    )
    components.delete(component);
    if (components.size) {
      this._entries.set(commentThreadId, components);
    } else {
      this._entries.delete(commentThreadId);
    }
  }
}

const commentssManager = new DocsCommentsManager();

export default commentssManager;
