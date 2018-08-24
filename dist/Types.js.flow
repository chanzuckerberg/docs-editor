// @flow

import {EditorState} from 'draft-js';

type HTMLCollectionLike = {
  [index: number]: ElementLike,
  length: number,
};



type EventLike = {

};

type ArrayLike<T> = {
  length: number,
  forEach: ((T, number) => void) => void,
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
  appendChild: (child: ElementLike) => ElementLike,
  cellIndex: ?number,
  cells: ?HTMLCollectionLike,
  classList: ?ArrayLike<string>,
  className: string,
  colSpan: ?number,
  dispatchEvent: (e: EventLike) => void,
  getAttribute: (attr: string) => string,
  hasAttribute: (attr: string) => boolean,
  href: string,
  id: string,
  innerHTML: string,
  nodeName: string,
  nodeType: number,
  ownerDocument: DocumentLike,
  parentElement: ?ElementLike,
  removeAttribute: (attr: string) => void,
  rowIndex: ?number,
  rowSpan: ?number,
  rows: ?HTMLCollectionLike,
  setAttribute: (attr: string, value: string) => void,
  style: CSSStyleDeclarationLike,
};

export type ClientRectLike = {
  height: number,
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

// This defines the APIs that depend on the specific app that the editor
// is running within. This serves as a bridge to enable editor communicate
// with the app server to do tasks such as uploading images, load comments,
// ...etc.
export type DocsEditorRuntime = {
  canUploadImage: () => boolean,
  canProxyImageSrc: (src: string) => boolean,
  getProxyImageSrc: (src: string) => string,
  uploadImage: (obj: Blob) => Promise<ImageLike>,
};

export type DocsEditorProps = {
  docsContext: ?Object,
  editorState: EditorState,
  id?: ?string,
  onChange: (e: EditorState) => void,
  placeholder?: ?string,
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
