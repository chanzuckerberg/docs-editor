// @flow

/*
export {convertToRaw, EditorState} from 'draft-js';
export {default as DocsActionTypes} from './DocsActionTypes';
export {default as DocsContext} from './DocsContext';
export {default as DocsEditor} from './DocsEditor';
export {default as DocsImageUploadControl} from './DocsImageUploadControl';
export {default as Timer} from './Timer';
export {default as captureDocumentEvents} from './captureDocumentEvents';
export {default as convertFromRaw} from './convertFromRaw';
export {default as withDocsContext} from './withDocsContext';
export {default as isEditorStateEmpty} from './isEditorStateEmpty';
export {default as showModalDialog} from './showModalDialog';
export {default as uniqueID} from './uniqueID';

// Flow types.
export type {DocsImageEntityData, ImageLike, DocsEditorRuntime} from './Types';
*/

import DocsActionTypes from './DocsActionTypes';
import DocsContext from './DocsContext';
import DocsEditor from './DocsEditor';
import DocsImageUploadControl from './DocsImageUploadControl';
import Timer from './Timer';
import Types from './Types';
import captureDocumentEvents from './captureDocumentEvents';
import convertFromRaw from './convertFromRaw';
import isEditorStateEmpty from './isEditorStateEmpty';
import showModalDialog from './showModalDialog';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {convertToRaw, EditorState} from 'draft-js';

export type {DocsImageEntityData, ImageLike, DocsEditorRuntime} from './Types';

module.exports = {
  DocsActionTypes,
  DocsContext,
  DocsEditor,
  DocsImageUploadControl,
  EditorState,
  Timer,
  captureDocumentEvents,
  convertFromRaw,
  convertToRaw,
  isEditorStateEmpty,
  showModalDialog,
  uniqueID,
  withDocsContext,

  // Deprecated exported members for backward compatibility.
  withDocsContext: withDocsContext,
};
