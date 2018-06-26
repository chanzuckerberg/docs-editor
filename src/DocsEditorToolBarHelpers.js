// @flow

import DocsActionTypes from './DocsActionTypes';
import {EditorState, RichUtils} from 'draft-js';
import {insertImage, insertTable, insertMath, toggleAnnotation, insertExpandable} from './DocsModifiers';

import type {Spec} from './DocsEditorToolBarButton';
import type {BaseEditor} from './Types';

type EditCapability = {
  annotation: boolean,
  blockStyles: ?Set<any>,
  default: boolean,
  history: ?Set<any>,
  inlineStyles: ?Set<any>,
  insert: boolean,
  table: boolean,
};

const EMPTY_OBJECT = {};

const INSERT_SPECS = [
  {
    action: DocsActionTypes.IMAGE_INSERT,
    icon: 'insert_photo',
    label: 'Insert Image',
    modifier: insertImage,
  },
  {
    action: DocsActionTypes.TABLE_INSERT,
    icon: 'grid_on',
    label: 'Insert Table',
    modifier: insertTable,
  },
  {
    action: DocsActionTypes.MATH_INSERT,
    icon: 'functions',
    label: 'Math',
    modifier: insertMath,
  },
  {
    action: DocsActionTypes.EXPANDABLE_INSERT,
    icon: 'more',
    label: 'Expandable',
    modifier: insertExpandable,
  },
];

const INLINE_SPECS = [
  {
    action: DocsActionTypes.TEXT_LINK,
    icon: 'link',
    label: 'Add link',
    style: '',
  },
  {
    action: DocsActionTypes.TEXT_B,
    icon: 'format_bold',
    label: 'Bold',
    style: 'BOLD',
  },
  {
    action: DocsActionTypes.TEXT_I,
    icon: 'format_italic',
    label: 'Italic',
    style: 'ITALIC',
  },
  {
    action: DocsActionTypes.TEXT_U,
    icon: 'format_underlined',
    label: 'Underline',
    style: 'UNDERLINE',
  },
  {
    action: DocsActionTypes.TEXT_STRIKE,
    icon: 'strikethrough_s',
    label: 'Strike',
    style: 'STRIKETHROUGH',
  },
  {
    action: DocsActionTypes.TEXT_VAR,
    icon: 'code',
    label: 'Code',
    style: 'CODE',
  },
];

const BLOCK_SPECS = [
  {
    action: DocsActionTypes.TEXT_UL,
    icon: 'format_list_bulleted',
    label: 'Unordered List',
    style: 'unordered-list-item',
  },
  {
    action: DocsActionTypes.TEXT_OL,
    icon: 'format_list_numbered',
    label: 'Ordered List',
    style: 'ordered-list-item',
  },
  {
    action: DocsActionTypes.TEXT_BLOCK_QUOTE,
    icon: 'format_quote',
    label: 'Block Quote',
    style: 'blockquote',
  },
  {
    action: DocsActionTypes.TEXT_H1,
    label: 'H1',
    style: 'header-one',
  },
  {
    action: DocsActionTypes.TEXT_H2,
    label: 'H2',
    style: 'header-two',
  },
  {
    action: DocsActionTypes.TEXT_H3,
    label: 'H3',
    style: 'header-three',
  },
  {
    action: DocsActionTypes.TEXT_H4,
    label: 'H4',
    style: 'header-four',
  },
  // {
  //   action: DocsActionTypes.TEXT_H5,
  //   label: 'H5',
  //   style: 'header-five',
  // },
];

const HISTORY_SPECS = [
  {
    action: DocsActionTypes.HISTORY_UNDO,
    icon: 'undo',
    label: 'Undo',
    modifier: EditorState.undo,
  },
  {
    action: DocsActionTypes.HISTORY_REDO,
    icon: 'redo',
    label: 'Redo',
    modifier: EditorState.redo,
  },
];

const ANNOTATION_SPECS = [
  {
    action: DocsActionTypes.TEXT_ANNOTATION,
    icon: 'format_color_text',
    label: 'Highlight',
    modifier: toggleAnnotation,
  },
];

function isEditEnabled(editor: ?BaseEditor): boolean {
  if (!editor) {
    return false;
  }
  const {onChange, editorState} = editor.props;
  return !!(onChange && editorState);
}

function isAnnotationEnabled(editor: ?BaseEditor): boolean {
  if (!editor || !isEditEnabled(editor)) {
    return false;
  }

  const {editorState} = editor.props;
  const selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
}

function getEditableInlineStyles(editor: ?BaseEditor): ?Set<any> {
  if (!editor || !isEditEnabled(editor)) {
    return null;
  }
  const {onChange, editorState} = editor.props;

  if (!onChange || !editorState) {
    return null;
  }

  const selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return null;
  }

  const currentStyle = editorState.getCurrentInlineStyle();
  const result = new Set();
  INLINE_SPECS.forEach(spec => {
    if (currentStyle.has(spec.style)) {
      result.add(spec.style);
    }
  });
  return result;
}

function getEditableBlockStyles(editor: ?BaseEditor): ?Set<any> {
  if (!editor || !isEditEnabled(editor)) {
    return null;
  }
  const {onChange, editorState} = editor.props;

  if (!onChange || !editorState) {
    return null;
  }

  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(selection.getStartKey());
  const blockType = contentBlock ? contentBlock.getType() : null;
  const result = new Set();
  if (blockType) {
    BLOCK_SPECS.forEach(spec => {
      if (spec.style === blockType) {
        result.add(spec.style);
      }
    });
  }
  return result;
}

function getEditableHistory(editor: ?BaseEditor): ?Set<any> {
  if (!editor || !isEditEnabled(editor)) {
    return null;
  }
  const {onChange, editorState} = editor.props;
  if (!onChange || !editorState) {
    return null;
  }
  const result = new Set();
  if (editorState.getRedoStack().size) {
    result.add(DocsActionTypes.HISTORY_REDO);
  }
  if (editorState.getUndoStack().size) {
    result.add(DocsActionTypes.HISTORY_UNDO);
  }
  return result;
}

function isInsertTableEnabled(editor: ?BaseEditor): boolean {
  if (!editor || !isEditEnabled(editor)) {
    return false;
  }
  const editorProps: any = editor.props;
  const {onChange, editorState, cellIndex, rowIndex} = editorProps;
  const allowNestedTable = true;
  // If this is a editor for cell, don't allow it (if allowNestedTable is false).
  return !!(
    onChange &&
    editorState &&
    ((cellIndex === undefined && rowIndex === undefined) || allowNestedTable)
  );
}

function isInsertEnabled(editor: ?BaseEditor): boolean {
  if (!editor || !isEditEnabled(editor)) {
    return false;
  }
  const {editorState} = editor.props;
  const selectionState = editorState.getSelection();
  return selectionState.isCollapsed();
}

function maybeInsertBlock(
  spec: Spec,
  editorState: EditorState,
): ?EditorState {
  const {action, modifier} = spec;
  for (let ii = 0, jj = INSERT_SPECS.length; ii < jj; ii++) {
    const currSpec = INSERT_SPECS[ii];
    if (currSpec.action === action && modifier) {
      return modifier(editorState);
    }
  }
  return null;
}

function getEditCapability(editor: ?BaseEditor): EditCapability {
  return {
    annotation: isAnnotationEnabled(editor),
    blockStyles: getEditableBlockStyles(editor),
    default: isEditEnabled(editor),
    history: getEditableHistory(editor),
    inlineStyles: getEditableInlineStyles(editor),
    table: isInsertTableEnabled(editor),
    insert: isInsertEnabled(editor),
  };
}

function maybeFormatInlineText(
  spec: Spec,
  editorState: EditorState,
): ?EditorState {
  const {action, style} = spec;
  for (let ii = 0, jj = INLINE_SPECS.length; ii < jj; ii++) {
    const currSpec = INLINE_SPECS[ii];
    if (currSpec.action === action && style) {
      return RichUtils.toggleInlineStyle(editorState, style);
    }
  }
  return null;
}

function maybeFormatBlockText(
  spec: Spec,
  editorState: EditorState,
): ?EditorState {
  const {action, style} = spec;
  for (let ii = 0, jj = BLOCK_SPECS.length; ii < jj; ii++) {
    const currSpec = BLOCK_SPECS[ii];
    if (currSpec.action === action && style) {
      return RichUtils.toggleBlockType(editorState, style);
    }
  }
  return null;
}

function maybeUpdateHistory(
  spec: Spec,
  editorState: EditorState,
): ?EditorState {
  const {action, modifier} = spec;
  for (let ii = 0, jj = HISTORY_SPECS.length; ii < jj; ii++) {
    const currSpec = HISTORY_SPECS[ii];
    if (currSpec.action === action && modifier) {
      return modifier(editorState);
    }
  }
  return null;
}

function maybeUpdateAnnotation(
  spec: Spec,
  editorState: EditorState,
): ?EditorState {
  const {action, modifier} = spec;
  for (let ii = 0, jj = ANNOTATION_SPECS.length; ii < jj; ii++) {
    const currSpec = ANNOTATION_SPECS[ii];
    if (currSpec.action === action && modifier) {
      return modifier(editorState);
    }
  }
  return null;
}

module.exports = {
  ANNOTATION_SPECS,
  BLOCK_SPECS,
  EMPTY_OBJECT,
  HISTORY_SPECS,
  INLINE_SPECS,
  INSERT_SPECS,
  getEditCapability,
  maybeFormatBlockText,
  maybeFormatInlineText,
  maybeInsertBlock,
  maybeUpdateHistory,
  maybeUpdateAnnotation,
};
