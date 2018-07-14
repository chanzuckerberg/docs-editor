// @flow

import DocsActionTypes from './DocsActionTypes';
import DocsContext from './DocsContext';
import DocsEditor from './DocsEditor';
import DocsImageUploadControl from './DocsImageUploadControl';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import convertFromRaw from './convertFromRaw';
import docsWithContext from './docsWithContext';
import showModalDialog from './showModalDialog';
import uniqueID from './uniqueID';

import {convertToRaw, EditorState} from 'draft-js';
import {isEditorStateEmpty} from './DocsHelpers';

import type {ImageEntityData, DOMImage, EditorRuntime} from './Types';

export type DocsDOMImage = DOMImage;
export type DocsEditorRuntime = EditorRuntime;
export type DocsImageEntityData = ImageEntityData;

module.exports = {
  DocsActionTypes,
  DocsContext,
  DocsEditor,
  DocsImageUploadControl,
  EditorState,
  convertFromRaw,
  convertToRaw,
  docsWithContext,
  isEditorStateEmpty,
};
