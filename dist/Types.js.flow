// @flow

import React from 'react';
import {EditorState} from 'draft-js';

type EventLike = {

};

type ArrayLike<T> = {
  length: number,
  forEach: ((T, number) => void) => void,
};

export type HTMLCollectionLike = {
  [index: number]: ElementLike,
  length: number,
};


// e.g. {'color': 'red'}
export type CSSStyleDeclarationLike = {
  [string]: string,
};

export type DocumentLike = {
  close: () => void,
  getElementsByTagName: (tag: string) => ArrayLike<Element>,
  open: () => void,
  querySelectorAll: (selector: string) => ArrayLike<ElementLike>,
  styleSheets: any,
  write: (html: string) => void,
};

export type BgStyle = 'dark';

export type ElementLike = {
  appendChild: (child: ElementLike | Element) => ElementLike,
  cellIndex: ?number,
  cells: ?HTMLCollectionLike,
  classList: ?ArrayLike<string>,
  className: string,
  colSpan: ?number,
  dispatchEvent: (e: EventLike | Element) => void,
  getAttribute: (attr: string) => string,
  getBoundingClientRect: () => ClientRectLike,
  hasAttribute: (attr: string) => boolean,
  href: string,
  id: string,
  innerHTML: string,
  nextElementSibling: ?ElementLike,
  nodeName: string,
  nodeType: number,
  outerHTML: string,
  ownerDocument: DocumentLike,
  parentElement: ?ElementLike,
  parentNode: ?ElementLike,
  previousElementSibling: ?ElementLike,
  querySelectorAll: (s: string) => HTMLCollectionLike,
  removeAttribute: (attr: string) => void,
  rowIndex: ?number,
  rowSpan: ?number,
  rows: ?HTMLCollectionLike,
  scrollTop: number,
  setAttribute: (attr: string, value: string) => void,
  style: CSSStyleDeclarationLike,
  tBodies: HTMLCollectionLike,
};

export type ClientRectLike = {
  height: number,
  left: number,
  right: number,
  top: number,
  width: number,
  x: number,
  y: number,
};

export type ImageLike = {
  height: number,
  id: string,
  src: string,
  width: number,
};

export type DocsEditorProps = {
  docsContext?: ?Object,
  editorState: EditorState,
  id?: ?string,
  onChange: (e: EditorState) => void,
  placeholder?: any,
};

export type DocsEditorLike = {
  id: string,
  props: DocsEditorProps,
};

export type DocsLinkEtityData = {
  url: string,
};

export type DocsAnnotationEtityData = {
  token: ?string,
  color: string,
};

export type DocsTableEntityData = {
  cellBgStyles?: ?{[cellId: string]: string},
  cellColSpans?: ?{[cellId: string]: number},
  cellRowSpans?: ?{[cellId: string]: number},
  colWidths?: ?Array<number>,
  rowHeights?: ?{[rowIndex: number]: number},
  colsCount: number,
  leftColBgStyle?: ?string,
  noBorders?: ?boolean,
  paddingSize?: ?string,
  rowsCount: number,
  topRowBgStyle?: ?BgStyle,
};

export type DocsImageEntityData = {
  align?: ?string,
  frame?: ?boolean,
  height?: ?number,
  url: ?string,
  width?: ?number,
};

export type DocsMathEntityData = {
  asciimath?: ?string,
  latex?: ?string,
  text?: ?string,
  xml?: ?string,
};

export type DocsCommentEntityData = {
  commentThreadId: string,
};

export type DocsCommentElement = {
  forceUpdate: () => void,
};

export type RenderCommentProps = {
  commentThreadId: string,
  isActive: boolean,
  requestCommentThreadDeletion: Function,
  requestCommentThreadReflow: Function,
};

export type RenderCommentCall = (
  props: RenderCommentProps,
) => ?React.Element<any>;
