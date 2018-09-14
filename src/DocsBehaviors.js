// @flow

import CalculatorBehavior from './CalculatorBehavior';
import DocsActionTypes from './DocsActionTypes';
import DocsContext from './DocsContext';
import DocsImageEditor from './DocsImageEditor';
import DocsMathEditor from './DocsMathEditor';
import DocsTextInputEditor from './DocsTextInputEditor';
import getCurrentSelectionEntity from './getCurrentSelectionEntity';
import returnFalse from './returnFalse';
import returnTrue from './returnTrue';
import showModalDialog from './showModalDialog';
import updateEntityData from './updateEntityData';
import {EditorState, RichUtils} from 'draft-js';
import {insertImage, insertTable, insertMath, toggleAnnotation, insertExpandable, updateLink, indentMore, indentLess} from './DocsModifiers';

import type {ModalHandle} from './showModalDialog';

type OnChange = (e: EditorState) => void;
type Update = (e: EditorState, o: OnChange, d: DocsContext) => ?ModalHandle;

// List item depths limited to 4.
// https://github.com/facebook/draft-js/issues/122
const MAX_DEPTH = 4;
const MIN_DEPTH = 0;

export type DocsBehavior = {
  action: string,
  icon?: ?string,
  isActive: (e: EditorState) => boolean,
  isEnabled: (e: EditorState) => boolean,
  label: string,
  update: Update,
};

export const CALCULATOR: DocsBehavior = new CalculatorBehavior();

export const IMAGE: DocsBehavior = {
  action: DocsActionTypes.IMAGE_INSERT,
  icon: 'insert_photo',
  label: 'Insert Image',
  isEnabled: hasNoSelection,
  isActive: returnFalse,
  update: showImageEditorModalDialog,
};

export const TABLE: DocsBehavior = {
  action:  DocsActionTypes.TABLE_INSERT,
  icon: 'grid_on',
  label: 'Insert Table',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: (editorState, onChange) => onChange(insertTable(editorState)),
};

export const MATH: DocsBehavior = {
  action: DocsActionTypes.MATH_INSERT,
  icon: 'functions',
  label: 'Math',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: showMathEditorModalDialog,
};

export const EXPANDABLE: DocsBehavior = {
  action: DocsActionTypes.EXPANDABLE_INSERT,
  icon: 'expand_more',
  label: 'Expandable',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: (editorState, onChange) => onChange(insertExpandable(editorState)),
};

export const LINK: DocsBehavior = {
  action: DocsActionTypes.TEXT_LINK,
  icon: 'link',
  label: 'Add link',
  isActive: (editorState) => RichUtils.currentBlockContainsLink(editorState),
  isEnabled: hasSelection,
  update: showLinkEditorModalDialog,
};

export const BOLD: DocsBehavior = {
  action: DocsActionTypes.TEXT_B,
  icon: 'format_bold',
  label: 'Bold',
  isActive: (e) => isInlineStyle('BOLD', e),
  isEnabled: hasSelection,
  update: (e, o, d) => toggleInlineStyle('BOLD', e, o, d),
};

export const ITALIC: DocsBehavior = {
  action: DocsActionTypes.TEXT_I,
  icon: 'format_italic',
  label: 'Italic',
  style: 'ITALIC',
  isActive: (e) => isInlineStyle('ITALIC', e),
  isEnabled: hasSelection,
  update: (e, o, d) => toggleInlineStyle('ITALIC', e, o, d),
};

export const UNDERLINE: DocsBehavior = {
  action: DocsActionTypes.TEXT_U,
  icon: 'format_underlined',
  label: 'Underline',
  isActive: (e) => isInlineStyle('UNDERLINE', e),
  isEnabled: hasSelection,
  update: (e, o, d) => toggleInlineStyle('UNDERLINE', e, o, d),
};

export const STRIKE: DocsBehavior = {
  action: DocsActionTypes.TEXT_STRIKE,
  icon: 'strikethrough_s',
  label: 'Strike',
  isActive: (e) => isInlineStyle('STRIKETHROUGH', e),
  isEnabled: hasSelection,
  update: (e, o, d) => toggleInlineStyle('STRIKETHROUGH', e, o, d),
};

export const CODE: DocsBehavior = {
  action: DocsActionTypes.TEXT_VAR,
  icon: 'code',
  label: 'Code',
  isActive: (e) => isInlineStyle('CODE', e),
  isEnabled: hasSelection,
  update: (e, o, d) => toggleInlineStyle('CODE', e, o, d),
};

export const HIGHLIGHT: DocsBehavior = {
  action: DocsActionTypes.TEXT_HIGHLIGHT,
  icon: 'format_color_text',
  label: 'Highlight',
  isActive: returnFalse,
  isEnabled: hasSelection,
  update: noop,
};

export const UNORDERED_LIST: DocsBehavior = {
  action: DocsActionTypes.TEXT_UL,
  icon: 'format_list_bulleted',
  label: 'Unordered List',
  isActive: (e) => isBlockType('unordered-list-item', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('unordered-list-item', e, o, d),
};

export const ORDERED_LIST: DocsBehavior = {
  action: DocsActionTypes.TEXT_OL,
  icon: 'format_list_numbered',
  label: 'Ordered List',
  isActive: (e) => isBlockType('ordered-list-item', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('ordered-list-item', e, o, d),
};

export const INDENT_MORE: DocsBehavior = {
  action: DocsActionTypes.INDENT_MORE,
  icon: 'format_indent_increase',
  label: 'Indent More',
  isActive: returnFalse,
  isEnabled: (e) => isIndentable(1, e),
  update: (editorState, onChange) => onChange(indentMore(editorState)),
};

export const INDENT_LESS: DocsBehavior = {
  action: DocsActionTypes.INDENT_LESS,
  icon: 'format_indent_decrease',
  label: 'Indent Less',
  isActive: returnFalse,
  isEnabled: (e) => isIndentable(-1, e),
  update: (editorState, onChange) => onChange(indentLess(editorState)),
};

export const BLOCK_QUOTE: DocsBehavior = {
  action: DocsActionTypes.TEXT_BLOCK_QUOTE,
  icon: 'format_quote',
  label: 'Block Quote',
  isActive: (e) => isBlockType('blockquote', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('blockquote', e, o, d),
};

export const H1: DocsBehavior = {
  action: DocsActionTypes.TEXT_H1,
  label: 'H1',
  isActive: (e) => isBlockType('header-one', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('header-one', e, o, d),
};

export const H2: DocsBehavior = {
  action: DocsActionTypes.TEXT_H2,
  label: 'H2',
  isActive: (e) => isBlockType('header-two', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('header-two', e, o, d),
};

export const H3: DocsBehavior = {
  action: DocsActionTypes.TEXT_H3,
  label: 'H3',
  isActive: (e) => isBlockType('header-three', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('header-three', e, o, d),
};

export const H4: DocsBehavior = {
  action: DocsActionTypes.TEXT_H4,
  label: 'H4',
  isActive: (e) => isBlockType('header-four', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('header-four', e, o, d),
};

export const H5: DocsBehavior = {
  action: DocsActionTypes.TEXT_H5,
  label: 'H5',
  style: 'header-five',
  isActive: (e) => isBlockType('header-five', e),
  isEnabled: returnTrue,
  update: (e, o, d) => toggleBlockType('header-five', e, o, d),
};

export const UNDO: DocsBehavior = {
  action: DocsActionTypes.HISTORY_UNDO,
  icon: 'undo',
  label: 'Undo',
  isActive: returnFalse,
  isEnabled: canUndo,
  update: undo,
};

export const REDO: DocsBehavior = {
  action: DocsActionTypes.HISTORY_UNDO,
  icon: 'redo',
  label: 'Redo',
  isActive: returnFalse,
  isEnabled: canRedo,
  update: redo,
};

function redo(editorState: EditorState, onChange: OnChange) {
  onChange(EditorState.redo(editorState));
}

function undo(editorState: EditorState, onChange: OnChange) {
  onChange(EditorState.undo(editorState));
}

function canRedo(editorState: EditorState): boolean {
  return editorState.getRedoStack().size > 0;
}

function canUndo(editorState: EditorState): boolean {
  return editorState.getUndoStack().size > 0;
}

function isBlockType(type: string, editorState: EditorState): boolean {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(selection.getStartKey());
  const blockType = contentBlock ? contentBlock.getType() : null;
  return blockType === type;
}

function isIndentable(adjustment: number, editorState: EditorState): boolean {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(selection.getStartKey());
  const blockType = contentBlock ? contentBlock.getType() : null;

  if (
    blockType !== 'unordered-list-item' &&
    blockType !== 'ordered-list-item'
  ) {
    return false;
  }
  const depth = contentBlock ? contentBlock.getDepth() : 0;
  if (adjustment > 0) {
    return (depth + adjustment) <= MAX_DEPTH;
  } else if (adjustment < 0) {
    return (depth + adjustment) >= MIN_DEPTH;
  } else {
    return false;
  }
}

function isInlineStyle(style: string, editorState: EditorState): boolean {
  const selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return false;
  }

  const currentStyle = editorState.getCurrentInlineStyle();
  return currentStyle.has(style);
}

function hasSelection(editorState: EditorState): boolean {
  const selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
}

function hasNoSelection(editorState: EditorState): boolean {
  const selectionState = editorState.getSelection();
  return selectionState.isCollapsed();
}

function toggleBlockType(
  blockType: string,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
): void {
  onChange(RichUtils.toggleBlockType(editorState, blockType));
}

function toggleInlineStyle(
  style: string,
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
): void {
  onChange(RichUtils.toggleInlineStyle(editorState, style));
}

function noop(
  editorState: EditorState,
  onChange: OnChange,
  docsContext: DocsContext,
) {
  console.log('not supported');
}

// This opens an image editor for the image that was just inserted by user.
function showImageEditorModalDialog(
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
