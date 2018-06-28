// @flow

import {EditorState} from 'draft-js';

// TODO(Fix this.)
export type DOMElement = any;

export type Action = {
  editor: BaseEditor,
  type: string,
};

export type ReducerState = {
  editorState: any,
};

export type DOMRect = {
  height: number,
  width: number,
  x: number,
  y: number,
};

export type DOMImage = {
  element?: ?DOMElement,
  height: number,
  src: string,
  width: number,
};

// This defines the APIs that depend on the specific app that the editor
// is running within. This serves as a bridge to enable editor communicate
// with the app server to do tasks such as uploading images, load comments,
// ...etc.
export type EditorRuntime = {
  canUploadImage: () => boolean,
  canProxyImageSrc: (src: string) => boolean,
  getProxyImageSrc: (src: string) => string,
  uploadImage: (obj: Blob) => Promise<DOMImage>,
};

export type EditorProps = {
  docsContext: ?Object,
  editorState: EditorState,
  id?: ?string,
  onChange: (e: EditorState) => void,
  placeholder?: ?string,
};

export type BaseEditor = {
  id: string,
  props: EditorProps,
};

export type BgStyle = 'dark';

export type LinkEtityData = {
  url: string,
};

export type AnnotationEtityData = {
  token: ?string,
  color: string,
};

export type TableEntityData = {
  colWidths?: ?Array<number>,
  colsCount: number,
  leftColBgStyle?: ?string,
  noBorders?: ?boolean,
  paddingSize?: ?string,
  rowsCount: number,
  topRowBgStyle?: ?BgStyle,
};

export type ImageEntityData = {
  align?: ?string,
  frame?: ?boolean,
  height?: ?number,
  url: ?string,
  width?: ?number,
};

export type MathEntityData = {
  asciimath?: ?string,
  latex?: ?string,
  text?: ?string,
  xml?: ?string,
};
