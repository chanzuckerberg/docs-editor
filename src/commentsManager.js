// @flow

import DocsEventTypes from './DocsEventTypes';
import asElement from './asElement';
import captureDocumentEvents from './captureDocumentEvents';
import convertFromRaw from './convertFromRaw';
import getDOMSelectionNode from './getDOMSelectionNode';
import invariant from 'invariant';
import lookupElementByAttribute from './lookupElementByAttribute';
import {EditorState} from 'draft-js';

import type {DocsCommentElement, ElementLike} from './Types';

export const ATTRIBUTE_COMMENT_ACTIVE = 'data-docs-comment-active';
export const ATTRIBUTE_COMMENT_THREAD_ID = 'data-docs-comment-thread-id';

type Disposable = {
  dispose: () => void,
};

type ObserveCallback = (info: {type: string, commentThreadId: ?string}) => void;

class DocsCommentsManager {

  _activeCommentThreadId: ?string;
  _entries: Map<string, Set<DocsCommentElement>>;
  _eventsCapture: ?Disposable;
  _observeCallbacks: Set<ObserveCallback>;
  _editorState: EditorState;

  constructor() {
    this._activeCommentThreadId = null;
    this._eventsCapture = null;
    this._entries = new Map();
    this._observeCallbacks = new Set();
    this._editorState = convertFromRaw({})
  }

  registerCommentElement(commentThreadId: string, component: Object): void {
    const components = this._entries.get(commentThreadId) || new Set();
    if (components.has(component)) {
      return;
    }
    invariant(!components.has(component), 'already registered');
    components.add(component);
    this._entries.set(commentThreadId, components);
    if (this._entries.size === 1) {
      this._listen();
    }
  }

  unregisterCommentElement(commentThreadId: string, component: Object): void {
    const components = this._entries.get(commentThreadId);
    if (!components || !components.has(component)) {
      return;
    }
    components.delete(component);
    if (components.size) {
      this._entries.set(commentThreadId, components);
    } else {
      this._entries.delete(commentThreadId);
    }
    if (this._entries.size === 0) {
      this._unlisten();
    }
  }

  requestCommentThreadDeletion(commentThreadId: string): void {
    Array.from(this._observeCallbacks).forEach(fn => fn({
      type: DocsEventTypes.COMMENT_REQUEST_DELETE,
      commentThreadId,
    }));
  }

  observe(callback: (info: {type: string, commentThreadId: ?string}) => void) {
    this._observeCallbacks.add(callback);
  }

  unobserve(callback: (info: {type: string, commentThreadId: ?string}) => void) {
    this._observeCallbacks.delete(callback);
  }

  setEditorState(editorState: EditorState): void {
    if (editorState !== this._editorState) {
      this._editorState = editorState;
      this._onChange();
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

  _listen(): void {
    if (this._eventsCapture) {
      return;
    }
    this._eventsCapture = captureDocumentEvents({
      'keyup': this._onKeyDown,
      'mousedown': this._onMouseDown,
    });
  }

  _unlisten(): void {
    if (!this._eventsCapture) {
      return;
    }
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = null;
  }

  _onKeyDown = (e: SyntheticEvent): void => {
    const selectionNode = getDOMSelectionNode();
    if (selectionNode && selectionNode.nodeType === 1) {
      this._onAccessElement(asElement(selectionNode));
    } else {
      const activeCommentThreadId = this._activeCommentThreadId;
      this._activeCommentThreadId = null;
      activeCommentThreadId && this._onChange();
    }
  };

  _onMouseDown = (e: SyntheticEvent): void => {
    if (!e.defaultPrevented) {
      this._onAccessElement(asElement(e.target));
    }
  };

  _onAccessElement(el: ElementLike): void {
    const target = lookupElementByAttribute(el, ATTRIBUTE_COMMENT_THREAD_ID);
    const activeCommentThreadId = this._activeCommentThreadId;
    if (target) {
      const commentThreadId = target.getAttribute(ATTRIBUTE_COMMENT_THREAD_ID);
      if (activeCommentThreadId && activeCommentThreadId === commentThreadId) {
        return;
      }
      this._activeCommentThreadId = commentThreadId;
      this._onChange();
    } else {
      if (activeCommentThreadId) {
        this._activeCommentThreadId = null;
        this._onChange();
      }
    }
  }

  _onChange(): void {
    Array.from(this._observeCallbacks).forEach(fn => fn({
      type: DocsEventTypes.COMMENT_CHANGE,
      commentThreadId: this._activeCommentThreadId,
    }));
  }
}

const commentsManager = new DocsCommentsManager();

export default commentsManager;
