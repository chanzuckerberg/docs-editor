// @flow

import ReactDOM from 'react-dom';
import invariant from 'invariant';
import {AtomicBlockUtils, ContentBlock, ContentState, EditorState, Entity} from './DraftJS';
import _ from 'underscore';

import type {DOMRect, DOMElement} from './Types';

const DEV_MODE = /http:\/\/localhost/.test(window.location.href);
const INVISIBLE_PREFIX = '\u200B\u2063\uFEFF\u200C';
const INVISIBLE_SUFFIX = INVISIBLE_PREFIX.split('').reverse().join('');

// Random core atomic helpers are placed at this file.
// Do not require any Component  or Modifier in this file to avoid circular
// dependiencies.

function warn(ex: any) {
  if (DEV_MODE) {
    console.warn(ex);
  }
}

function tryFindDOMNode(component: any): ?Node {
  try {
    return ReactDOM.findDOMNode(component);
  } catch (ex) {
    warn(ex);
    return null;
  }
}

function tryInsertAtomicBlock(
  editorState: EditorState,
  entityKey: string,
  text: string,
): ?EditorState {
  try {
    return AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      text,
    );
  } catch (ex) {
    warn(ex);
    return null;
  }
}

function tryGetEntityAtContentState(
  contentState: ContentState,
  entityKey: string,
): ?Entity {
  try {
    return contentState.getEntity(entityKey);
  } catch(ex) {
    // entity was removed, we should clean up `contentState` later.
    warn(ex);
    return null;
  }
}

function tryFocus(obj: any, resumeSelection: ?boolean): void {
  if (obj) {
    try {
      obj.focus(resumeSelection);
    } catch (ex) {
      warn(ex);
    }
  }
}

function tryBlur(obj: any): void {
  if (obj) {
    try {
      obj.blur();
    } catch (ex) {
      warn(ex);
    }
  }
}

function createDOMCustomEvent(
  type: string,
  bubbles: boolean,
  cancelable: boolean,
  detail: any,
): Event {
  if (detail === undefined) {
    detail = null;
  }
  return new CustomEvent(type, {bubbles, cancelable, detail});
}

function getComponentByElement(
  components: Set<Object>,
  element: any,
): ?Object {
  const elementToComponent = new Map();
  components.forEach((component: any) => {
    const node: any = ReactDOM.findDOMNode(component);
    if (node) {
      elementToComponent.set(node, component);
    }
  });

  while (element && element.nodeType === 1) {
    if (elementToComponent.has(element)) {
      return elementToComponent.get(element);
    }
    element = element.parentNode;
  }
  return null;
}

function getDOMSelectionRect(): ?DOMRect  {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  const range: any = selection.getRangeAt(0);
  let rect = range ? range.getBoundingClientRect() : null;
  if (
    rect &&
    rect.width === 0 &&
    rect.height === 0 &&
    rect.x === 0 &&
    rect.y === 0 &&
    range &&
    range.commonAncestorContainer
  ) {
    // If the selection is collapsed, the rect will be empty.
    // use the element's rect where the cursor is at instead.
    rect = range.commonAncestorContainer.getBoundingClientRect();
  }
  return rect;
}

function getDOMSelectionNode(): ?Element {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  const range: any = selection.getRangeAt(0);
  let node = range.commonAncestorContainer;
  if (node && node.nodeType === 3) {
    // TEXT_NODE
    node = node.parentNode;
  }
  return node || null;
}


function getDOMSelectionRange(): ?Object {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  return selection.getRangeAt(0);
}

function restoreDOMSelectionRange(range: Object): void {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function getCurrentSelectionEntity(editorState: EditorState): ?Object {
  const selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return null;
  }
  const contentState = editorState.getCurrentContent();
  const startKey = editorState.getSelection().getStartKey();
  const startOffset = editorState.getSelection().getStartOffset();
  const blockWithEntityAtBeginning = contentState.getBlockForKey(startKey);
  if (!blockWithEntityAtBeginning) {
    return null;
  }
  const entityKey = blockWithEntityAtBeginning.getEntityAt(startOffset);
  if (!entityKey) {
    return null;
  }
  return tryGetEntityAtContentState(contentState, entityKey);
}

function findEntitiesForType(
  entityType: string,
  contentBlock: ContentBlock,
  callback: Function,
  contentState: ContentState,
): void {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null || entityKey === undefined) {
      return false;
    }
    const entity = contentState.getEntity(entityKey);
    if (!entity) {
      return false;
    }
    return entity.getType() === entityType;
  }, callback);
}

function lookupElementByAttribute(
  element: ?Element,
  attr: string,
  value: ?string,
): ?Element {
  let node: any = element;
  while (node) {
    if (node && node.nodeType === 1) {
      if (value === undefined && node.hasAttribute(attr)) {
        return node;
      } else if (node.getAttribute(attr) === value) {
        return node;
      }
    }
    node = node.parentNode;
  }
  return null;
}

const latexEl: any = document.createElement('div');
function renderLatexAsHTML(latex: ?string): string {
  const {katex} = window;
  if (!latex) {
    return '';
  }
  latexEl.innerHTML = '';
  if (katex) {
    try {
      katex.render(latex, latexEl);
    } catch (ex) {
      latexEl.innerHTML = '';
      latexEl.appendChild(document.createTextNode(latex));
    }
  } else {
    latexEl.appendChild(document.createTextNode(latex));
  }
  const html = latexEl.innerHTML;
  latexEl.innerHTML = '';
  return html;
}

// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
function getSafeBodyFromHTML(html: string): ?Element {
  let doc;
  let root = null;
  // Provides a safe context
  if (
    document.implementation &&
    document.implementation.createHTMLDocument
  ) {
    doc = document.implementation.createHTMLDocument('');
    invariant(doc.documentElement, 'Missing doc.documentElement');
    doc.documentElement.innerHTML = html;
    root = doc.getElementsByTagName('body')[0];
  }
  return root;
}

function randomStr(range: number): string {
  return Math.round(range * Math.random()).toString(36);
}

// This prefix should ensure that id is unique across multiple
// web pages and sessions.
const ID_PREFIX = 'id-' + randomStr(9999) + '-' + Date.now().toString(36) + '-';

function uniqueID(): string {
  return _.uniqueId(ID_PREFIX);
}

function asElement(node: any): DOMElement {
  invariant(node && node.nodeType === 1, 'invalid element');
  const el: DOMElement = node;
  return el;
}

// This is copied from
// draft-js/src/component/utils/splitTextIntoTextBlocks.js
const NEWLINE_REGEX = /\r\n?|\n/g;
function splitTextIntoTextBlocks(text: string): Array<string> {
  return text.split(NEWLINE_REGEX);
}

function isEditorStateEmpty(editorState: EditorState): boolean {
  return !editorState.getCurrentContent().hasText();
}

module.exports = {
  INVISIBLE_PREFIX,
  INVISIBLE_SUFFIX,
  asElement,
  createDOMCustomEvent,
  findEntitiesForType,
  getComponentByElement,
  getCurrentSelectionEntity,
  getDOMSelectionNode,
  getDOMSelectionRange,
  getDOMSelectionRect,
  getSafeBodyFromHTML,
  isEditorStateEmpty,
  lookupElementByAttribute,
  renderLatexAsHTML,
  restoreDOMSelectionRange,
  splitTextIntoTextBlocks,
  tryBlur,
  tryFindDOMNode,
  tryFocus,
  tryGetEntityAtContentState,
  tryInsertAtomicBlock,
  tryWarn: warn,
  uniqueID,
};
