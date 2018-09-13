// @flow

import DocsActionTypes from './DocsActionTypes';
import DocsContext from './DocsContext';
import DocsImageEditor from './DocsImageEditor';
import DocsMathEditor from './DocsMathEditor';
import DocsTextInputEditor from './DocsTextInputEditor';
import getCurrentSelectionEntity from './getCurrentSelectionEntity';
import showModalDialog from './showModalDialog';
import updateEntityData from './updateEntityData';
import {EditorState, RichUtils} from 'draft-js';
import {insertImage, insertTable, insertMath, toggleAnnotation, insertExpandable, updateLink} from './DocsModifiers';

import type {ModalHandle} from './showModalDialog';

type OnChange = (e: EditorState) => void;
type Update = (f: Feature, e: EditorState, o: OnChange, d: DocsContext) => ?ModalHandle;

type Feature = {
  action: string,
  icon?: ?string,
  isActive: (f: Feature, e: EditorState) => boolean,
  isEnabled: (f: Feature, e: EditorState) => boolean,
  label?: ?string,
  style?: ?string,
  update: Update,
};

export type EditorToolbarFeature = Feature;

export const IMAGE: Feature = {
  action: DocsActionTypes.IMAGE_INSERT,
  icon: 'insert_photo',
  label: 'Insert Image',
  isEnabled: hasNoSelection,
  isActive: returnFalse,
  update: showImageEditorModalDialog,
};

export const TABLE: Feature = {
  action:  DocsActionTypes.TABLE_INSERT,
  icon: 'grid_on',
  label: 'Insert Table',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: (f, editorState, onChange) => onChange(insertTable(editorState)),
};

export const MATH: Feature = {
  action: DocsActionTypes.MATH_INSERT,
  icon: 'functions',
  label: 'Math',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: showMathEditorModalDialog,
};

export const EXPANDABLE: Feature = {
  action: DocsActionTypes.EXPANDABLE_INSERT,
  icon: 'expand_more',
  label: 'Expandable',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: (f, editorState, onChange) => onChange(insertExpandable(editorState)),
};

export const LINK: Feature = {
  action: DocsActionTypes.TEXT_LINK,
  icon: 'link',
  label: 'Add link',
  isActive: returnFalse,
  isEnabled: hasSelection,
  update: showLinkEditorModalDialog,
};

export const BOLD: Feature = {
  action: DocsActionTypes.TEXT_B,
  icon: 'format_bold',
  label: 'Bold',
  style: 'BOLD',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle,
};

export const ITALIC = {
  action: DocsActionTypes.TEXT_I,
  icon: 'format_italic',
  label: 'Italic',
  style: 'ITALIC',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle,
};

export const UNDERLINE = {
  action: DocsActionTypes.TEXT_U,
  icon: 'format_underlined',
  label: 'Underline',
  style: 'UNDERLINE',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle,
};

export const STRIKE: Feature = {
  action: DocsActionTypes.TEXT_STRIKE,
  icon: 'strikethrough_s',
  label: 'Strike',
  style: 'STRIKETHROUGH',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle,
};

export const CODE: Feature = {
  action: DocsActionTypes.TEXT_VAR,
  icon: 'code',
  label: 'Code',
  style: 'CODE',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle,
};

export const HIGHLIGHT: Feature = {
  action: DocsActionTypes.TEXT_HIGHLIGHT,
  icon: 'format_color_text',
  label: 'Highlight',
  isActive: returnFalse,
  isEnabled: hasSelection,
  update: noop,
};

export const UNORDERED_LIST = {
  action: DocsActionTypes.TEXT_UL,
  icon: 'format_list_bulleted',
  label: 'Unordered List',
  style: 'unordered-list-item',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const ORDERED_LIST ={
  action: DocsActionTypes.TEXT_OL,
  icon: 'format_list_numbered',
  label: 'Ordered List',
  style: 'ordered-list-item',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const BLOCK_QUOTE: Feature = {
  action: DocsActionTypes.TEXT_BLOCK_QUOTE,
  icon: 'format_quote',
  label: 'Block Quote',
  style: 'blockquote',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const H1: Feature = {
  action: DocsActionTypes.TEXT_H1,
  label: 'H1',
  style: 'header-one',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const H2: Feature = {
  action: DocsActionTypes.TEXT_H2,
  label: 'H2',
  style: 'header-two',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const H3: Feature = {
  action: DocsActionTypes.TEXT_H3,
  label: 'H3',
  style: 'header-three',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const H4 = {
  action: DocsActionTypes.TEXT_H4,
  label: 'H4',
  style: 'header-four',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const H5: Feature = {
  action: DocsActionTypes.TEXT_H5,
  label: 'H5',
  style: 'header-five',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle,
};

export const UNDO: Feature = {
  action: DocsActionTypes.HISTORY_UNDO,
  icon: 'undo',
  label: 'Undo',
  isActive: returnFalse,
  isEnabled: canUndo,
  update: undo,
};

export const REDO: Feature = {
  action: DocsActionTypes.HISTORY_UNDO,
  icon: 'redo',
  label: 'Redo',
  isActive: returnFalse,
  isEnabled: canRedo,
  update: redo,
};

function returnTrue(): boolean {
  return true;
}

function returnFalse(): boolean {
  return false;
}

function redo(feature: Feature, editorState: EditorState, onChange: OnChange) {
  onChange(EditorState.redo(editorState));
}

function undo(feature: Feature, editorState: EditorState, onChange: OnChange) {
  onChange(EditorState.undo(editorState));
}

function canRedo(feature: Feature, editorState: EditorState): boolean {
  return editorState.getRedoStack().size > 0;
}

function canUndo(feature: Feature, editorState: EditorState): boolean {
  return editorState.getUndoStack().size > 0;
}

function hasBlockStyle(feature: Feature, editorState: EditorState): boolean {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(selection.getStartKey());
  const blockType = contentBlock ? contentBlock.getType() : null;
  return blockType === feature.style;
}

function hasInlineStyle(feature: Feature, editorState: EditorState): boolean {
  const selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return false;
  }

  const currentStyle = editorState.getCurrentInlineStyle();
  return currentStyle.has(feature.style);
}

function hasSelection(feature: Feature, editorState: EditorState): boolean {
  const selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
}

function hasNoSelection(feature: Feature, editorState: EditorState): boolean {
  const selectionState = editorState.getSelection();
  return selectionState.isCollapsed();
}

function toggleBlockStyle(
  feature: Feature,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
): void {
  onChange(RichUtils.toggleBlockType(editorState, feature.style));
}

function toggleInlineStyle(
  feature: Feature,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
): void {
  onChange(RichUtils.toggleInlineStyle(editorState, feature.style));
}

function noop(
  feature: Feature,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
) {
  console.log('not supported', feature);
}

// This opens an image editor for the image that was just inserted by user.
function showImageEditorModalDialog(
  feature: Feature,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
): ModalHandle {
  // TODO:  This creates an extra history entry, fix it.
  const nextEditorState = insertImage(editorState);
  const contentState = nextEditorState.getCurrentContent();
  const entityKey = contentState.getLastCreatedEntityKey();
  const entity = contentState.getEntity(entityKey);
  const entityData = entity.getData();
  return showModalDialog(
    DocsImageEditor,
    {
      docsContext,
      entityData,
      title: 'Edit Image',
    },
    (newEntityData) => {
      if (newEntityData) {
        onChange(updateEntityData(
          nextEditorState,
          entityKey,
          newEntityData,
        ));
      }
    },
  );
}

function showLinkEditorModalDialog(
  feature: Feature,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
): ModalHandle {
  const linkEntity = getCurrentSelectionEntity(editorState);
  const currentURL = (linkEntity && linkEntity.getData().url) || '';
  return showModalDialog(DocsTextInputEditor, {
    title: 'Enter link URL or leave it empty to remove the link',
    value: currentURL,
  }, (newURL) => {
    if (newURL === undefined) {
      // Action was cancelled.
      return;
    }
    onChange(updateLink(editorState, newURL || null));
  });
}

// This opens an math editor for the math placeholder that was just inserted by
// user.
function showMathEditorModalDialog(
  feature: Feature,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
): ModalHandle {
  // TODO:  This creates an extra history entry, fix it.
  const nextEditorState = insertMath(editorState);
  const contentState = nextEditorState.getCurrentContent();
  const entityKey = contentState.getLastCreatedEntityKey();
  const entity = contentState.getEntity(entityKey);
  const entityData = entity.getData();
  return showModalDialog(
    DocsMathEditor,
    {
      docsContext,
      entityData,
    },
    (newEntityData) => {
      if (!newEntityData) {
        // Action was cancelled.
        return;
      }
      onChange(updateEntityData(
        nextEditorState,
        entityKey,
        newEntityData,
      ));
    },
  );
}
