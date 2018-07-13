// @flow

import DocsActionTypes from './src/DocsActionTypes';
import DocsContext from './src/DocsContext';
import DocsEditor from './src/DocsEditor';
import DocsImageUploadControl from './src/DocsImageUploadControl';
import React from 'react';
import convertFromRaw from './src/convertFromRaw';
import docsWithContext from './src/docsWithContext';

import {convertToRaw, EditorState} from 'draft-js';
import {isEditorStateEmpty} from './src/DocsHelpers';

import type {ImageEntityData, DOMImage, EditorRuntime} from './src/Types';

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
