// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsEventTypes from './DocsEventTypes';
import ReactDOM from 'react-dom';
import Timer from '../lib/Timer';
import captureDocumentEvents from '../lib/captureDocumentEvents';
import invariant from 'invariant';
import nullthrows from 'nullthrows';
import type {BaseEditor} from './Types';
import {createDOMCustomEvent, tryFocus, tryBlur, tryFindDOMNode} from './DocsHelpers';
import {updateEntityData} from './DocsModifiers';

// How long do we wait until starting transitioning focus from one editor to
// another.
const FOCUS_TRANSITION_DELAY_MS = 1;
// How long do we expect the focus transition should take.
const FOCUS_TRANSITION_DURATION_MS = 100;

function getEditorByElement(
  editors: Set<Object>,
  element: any,
): ?Object {
  const elementToEditor = new Map();
  editors.forEach((component: any) => {
    const node: any = tryFindDOMNode(component);
    if (node) {
      elementToEditor.set(node, component);
    }
  });

  while (element && element.nodeType === 1) {
    const id = element.getAttribute(DocsDataAttributes.EDITOR_FOR);
    if (id) {
      const editorNode = document.getElementById(id);
      if (elementToEditor.has(editorNode)) {
        return elementToEditor.get(editorNode);
      }
    }
    if (elementToEditor.has(element)) {
      return elementToEditor.get(element);
    }
    element = element.parentNode;
  }
  return null;
}

const {EDITOR_IN, EDITOR_OUT, EDITOR_REQUEST_UPDATE_ENTITY_DATA} = DocsEventTypes;

class DocsEditorFocusManager {

  static FOCUS_TRANSITION_DURATION_MS = FOCUS_TRANSITION_DURATION_MS;

  _editorsSet = new Set();
  _editorsMap = new Map();
  _eventsCapture = null;
  _activeEditor = null;
  _timer = new Timer();

  constructor() {
    this._eventsCapture = captureDocumentEvents({
      mousedown: this._onMouseDown,
      [EDITOR_REQUEST_UPDATE_ENTITY_DATA]:
        this._onEditorRequestUpdateEntityData,
    });
  }

  register(id: string, editor: BaseEditor) {
    invariant(!this._editorsMap.has(id), 'already registered');
    invariant(!this._editorsSet.has(editor), 'already registered');
    this._editorsSet.add(editor);
    this._editorsMap.set(id, editor);
  }

  unregister(id: string, editor: BaseEditor) {
    invariant(this._editorsMap.get(id) === editor, 'not registered');
    invariant(this._editorsSet.has(editor), 'not registered');
    this._editorsSet.delete(editor);
    this._editorsMap.delete(id);
  }

  _onEditorRequestUpdateEntityData = (e: any): void => {
    const {detail, target} = e;
    const {id} = target;
    const editor = this._editorsMap.get(id);
    if (!editor) {
      return;
    }
    const {entityKey, entityData} = nullthrows(detail);
    const {onChange, editorState} = nullthrows(editor.props);
    onChange(updateEntityData(editorState, entityKey, entityData));
  };

  _onMouseDown = (e: any): void => {
    const {target} = e;
    if (this._maybeTransferFocus(target)) {
      e.preventDefault();
    }
  };

  _maybeTransferFocus = (target: Element) => {
    this._timer.clear();

    const activeEditor = this._activeEditor;

    let node: any = target;
    while (node) {
      if (node.nodeType === 1) {
        if (node.getAttribute(DocsDataAttributes.TOOL)) {
          // Do not transfer editor's focus if event happened within a
          // tool that is used to assist the current editor.
          return false;
        }

        if (node.getAttribute(DocsDataAttributes.WIDGET)) {
          // It's a widget (e.g DocsExpandable), just move focus to it.
          if (activeEditor) {
            this._activeEditor = null;
            this._blurEditor(activeEditor);
          }
          this._timer.set(() => {
            const {activeElement, documentElement} = document;
            if (
              !documentElement ||
              !documentElement.contains(node) ||
              node === activeElement ||
              node.contains(activeElement)
            ) {
              // node is already focused.
              return;
            }
            tryFocus(node);
          }, FOCUS_TRANSITION_DELAY_MS);

          const {activeElement} = document;
          return activeElement ?
            activeElement !== node && !node.contains(activeElement) :
            true;
        }
      }
      node = node.parentNode;
    }

    this._activeEditor = null;

    const editor = getEditorByElement(this._editorsSet, target);
    if (!editor) {
      activeEditor && this._blurEditor(activeEditor);
      return false;
    }

    if (activeEditor && activeEditor !== editor) {
      this._blurEditor(activeEditor);
    }

    if (activeEditor && activeEditor === editor) {
      this._activeEditor = editor;
      return;
    }

    this._activeEditor = editor;

    if (editor) {
      this._timer.set(() => {
        const root = document.documentElement;
        if (root && this._activeEditor === editor && root.contains(target)) {
          this._focusEditor(editor, target);
        }
      }, FOCUS_TRANSITION_DELAY_MS);
    }
    return !!editor;
  };

  _blurEditor(editor: any): void {
    if (!this._editorsSet.has(editor)) {
      return;
    }
    const node = ReactDOM.findDOMNode(editor);
    if (!node) {
      return;
    }
    tryBlur(editor);
    const detail = {editor};
    const event = createDOMCustomEvent(EDITOR_OUT, true, true, detail);
    node.dispatchEvent(event);
  }

  _focusEditor(editor: any, target: Element): void {
    if (!this._editorsSet.has(editor)) {
      return;
    }
    const detail = {editor};
    const event = createDOMCustomEvent(EDITOR_IN, true, true, detail);
    const node: any = ReactDOM.findDOMNode(editor);
    if (!node) {
      return;
    }

    let currentNode: any = target;
    const scrollableNodes = new Map();
    // Record scrolltop which may change when focus changes.
    while (currentNode && currentNode.nodeType === 1) {
      const {scrollTop} = currentNode;
      if (scrollTop) {
        scrollableNodes.set(currentNode, scrollTop);
      }
      currentNode = currentNode.parentNode;
    }

    tryFocus(editor);
    node.dispatchEvent(event);

    // Resume scrolltop.
    scrollableNodes.forEach((y, currentNode) => {
      currentNode.scrollTop = y;
    });
  }
}

module.exports = DocsEditorFocusManager;
