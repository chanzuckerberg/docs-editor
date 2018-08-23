'use strict';

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_Spec = require('./DocsEditorToolBarButton').babelPluginFlowReactPropTypes_proptype_Spec || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var EMPTY_OBJECT = {};

var INSERT_SPECS = [{
  action: _DocsActionTypes2.default.IMAGE_INSERT,
  icon: 'insert_photo',
  label: 'Insert Image',
  modifier: _DocsModifiers.insertImage
}, {
  action: _DocsActionTypes2.default.TABLE_INSERT,
  icon: 'grid_on',
  label: 'Insert Table',
  modifier: _DocsModifiers.insertTable
}, {
  action: _DocsActionTypes2.default.MATH_INSERT,
  icon: 'functions',
  label: 'Math',
  modifier: _DocsModifiers.insertMath
}, {
  action: _DocsActionTypes2.default.EXPANDABLE_INSERT,
  icon: 'more',
  label: 'Expandable',
  modifier: _DocsModifiers.insertExpandable
}];

var INLINE_SPECS = [{
  action: _DocsActionTypes2.default.TEXT_LINK,
  icon: 'link',
  label: 'Add link',
  style: ''
}, {
  action: _DocsActionTypes2.default.TEXT_B,
  icon: 'format_bold',
  label: 'Bold',
  style: 'BOLD'
}, {
  action: _DocsActionTypes2.default.TEXT_I,
  icon: 'format_italic',
  label: 'Italic',
  style: 'ITALIC'
}, {
  action: _DocsActionTypes2.default.TEXT_U,
  icon: 'format_underlined',
  label: 'Underline',
  style: 'UNDERLINE'
}, {
  action: _DocsActionTypes2.default.TEXT_STRIKE,
  icon: 'strikethrough_s',
  label: 'Strike',
  style: 'STRIKETHROUGH'
}, {
  action: _DocsActionTypes2.default.TEXT_VAR,
  icon: 'code',
  label: 'Code',
  style: 'CODE'
}];

var BLOCK_SPECS = [{
  action: _DocsActionTypes2.default.TEXT_UL,
  icon: 'format_list_bulleted',
  label: 'Unordered List',
  style: 'unordered-list-item'
}, {
  action: _DocsActionTypes2.default.TEXT_OL,
  icon: 'format_list_numbered',
  label: 'Ordered List',
  style: 'ordered-list-item'
}, {
  action: _DocsActionTypes2.default.TEXT_BLOCK_QUOTE,
  icon: 'format_quote',
  label: 'Block Quote',
  style: 'blockquote'
}, {
  action: _DocsActionTypes2.default.TEXT_H1,
  label: 'H1',
  style: 'header-one'
}, {
  action: _DocsActionTypes2.default.TEXT_H2,
  label: 'H2',
  style: 'header-two'
}, {
  action: _DocsActionTypes2.default.TEXT_H3,
  label: 'H3',
  style: 'header-three'
}, {
  action: _DocsActionTypes2.default.TEXT_H4,
  label: 'H4',
  style: 'header-four'
}];

var HISTORY_SPECS = [{
  action: _DocsActionTypes2.default.HISTORY_UNDO,
  icon: 'undo',
  label: 'Undo',
  modifier: _draftJs.EditorState.undo
}, {
  action: _DocsActionTypes2.default.HISTORY_REDO,
  icon: 'redo',
  label: 'Redo',
  modifier: _draftJs.EditorState.redo
}];

var ANNOTATION_SPECS = [{
  action: _DocsActionTypes2.default.TEXT_ANNOTATION,
  icon: 'format_color_text',
  label: 'Highlight',
  modifier: _DocsModifiers.toggleAnnotation
}];

function isEditEnabled(editor) {
  if (!editor) {
    return false;
  }
  var _editor$props = editor.props,
      onChange = _editor$props.onChange,
      editorState = _editor$props.editorState;

  return !!(onChange && editorState);
}

function isAnnotationEnabled(editor) {
  if (!editor || !isEditEnabled(editor)) {
    return false;
  }

  var editorState = editor.props.editorState;

  var selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
}

function getEditableInlineStyles(editor) {
  if (!editor || !isEditEnabled(editor)) {
    return null;
  }
  var _editor$props2 = editor.props,
      onChange = _editor$props2.onChange,
      editorState = _editor$props2.editorState;


  if (!onChange || !editorState) {
    return null;
  }

  var selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return null;
  }

  var currentStyle = editorState.getCurrentInlineStyle();
  var result = new _set2.default();
  INLINE_SPECS.forEach(function (spec) {
    if (currentStyle.has(spec.style)) {
      result.add(spec.style);
    }
  });
  return result;
}

function getEditableBlockStyles(editor) {
  if (!editor || !isEditEnabled(editor)) {
    return null;
  }
  var _editor$props3 = editor.props,
      onChange = _editor$props3.onChange,
      editorState = _editor$props3.editorState;


  if (!onChange || !editorState) {
    return null;
  }

  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var contentBlock = contentState.getBlockForKey(selection.getStartKey());
  var blockType = contentBlock ? contentBlock.getType() : null;
  var result = new _set2.default();
  if (blockType) {
    BLOCK_SPECS.forEach(function (spec) {
      if (spec.style === blockType) {
        result.add(spec.style);
      }
    });
  }
  return result;
}

function getEditableHistory(editor) {
  if (!editor || !isEditEnabled(editor)) {
    return null;
  }
  var _editor$props4 = editor.props,
      onChange = _editor$props4.onChange,
      editorState = _editor$props4.editorState;

  if (!onChange || !editorState) {
    return null;
  }
  var result = new _set2.default();
  if (editorState.getRedoStack().size) {
    result.add(_DocsActionTypes2.default.HISTORY_REDO);
  }
  if (editorState.getUndoStack().size) {
    result.add(_DocsActionTypes2.default.HISTORY_UNDO);
  }
  return result;
}

function isInsertTableEnabled(editor) {
  if (!editor || !isEditEnabled(editor)) {
    return false;
  }
  var editorProps = editor.props;
  var onChange = editorProps.onChange,
      editorState = editorProps.editorState,
      cellIndex = editorProps.cellIndex,
      rowIndex = editorProps.rowIndex;

  var allowNestedTable = true;
  // If this is a editor for cell, don't allow it (if allowNestedTable is false).
  return !!(onChange && editorState && (cellIndex === undefined && rowIndex === undefined || allowNestedTable));
}

function isInsertEnabled(editor) {
  if (!editor || !isEditEnabled(editor)) {
    return false;
  }
  var editorState = editor.props.editorState;

  var selectionState = editorState.getSelection();
  return selectionState.isCollapsed();
}

function maybeInsertBlock(spec, editorState) {
  var action = spec.action,
      modifier = spec.modifier;

  for (var ii = 0, jj = INSERT_SPECS.length; ii < jj; ii++) {
    var currSpec = INSERT_SPECS[ii];
    if (currSpec.action === action && modifier) {
      return modifier(editorState);
    }
  }
  return null;
}

function getEditCapability(editor) {
  return {
    annotation: isAnnotationEnabled(editor),
    blockStyles: getEditableBlockStyles(editor),
    default: isEditEnabled(editor),
    history: getEditableHistory(editor),
    inlineStyles: getEditableInlineStyles(editor),
    table: isInsertTableEnabled(editor),
    insert: isInsertEnabled(editor)
  };
}

function maybeFormatInlineText(spec, editorState) {
  var action = spec.action,
      style = spec.style;

  for (var ii = 0, jj = INLINE_SPECS.length; ii < jj; ii++) {
    var currSpec = INLINE_SPECS[ii];
    if (currSpec.action === action && style) {
      return _draftJs.RichUtils.toggleInlineStyle(editorState, style);
    }
  }
  return null;
}

function maybeFormatBlockText(spec, editorState) {
  var action = spec.action,
      style = spec.style;

  for (var ii = 0, jj = BLOCK_SPECS.length; ii < jj; ii++) {
    var currSpec = BLOCK_SPECS[ii];
    if (currSpec.action === action && style) {
      return _draftJs.RichUtils.toggleBlockType(editorState, style);
    }
  }
  return null;
}

function maybeUpdateHistory(spec, editorState) {
  var action = spec.action,
      modifier = spec.modifier;

  for (var ii = 0, jj = HISTORY_SPECS.length; ii < jj; ii++) {
    var currSpec = HISTORY_SPECS[ii];
    if (currSpec.action === action && modifier) {
      return modifier(editorState);
    }
  }
  return null;
}

function maybeUpdateAnnotation(spec, editorState) {
  var action = spec.action,
      modifier = spec.modifier;

  for (var ii = 0, jj = ANNOTATION_SPECS.length; ii < jj; ii++) {
    var currSpec = ANNOTATION_SPECS[ii];
    if (currSpec.action === action && modifier) {
      return modifier(editorState);
    }
  }
  return null;
}

module.exports = {
  ANNOTATION_SPECS: ANNOTATION_SPECS,
  BLOCK_SPECS: BLOCK_SPECS,
  EMPTY_OBJECT: EMPTY_OBJECT,
  HISTORY_SPECS: HISTORY_SPECS,
  INLINE_SPECS: INLINE_SPECS,
  INSERT_SPECS: INSERT_SPECS,
  getEditCapability: getEditCapability,
  maybeFormatBlockText: maybeFormatBlockText,
  maybeFormatInlineText: maybeFormatInlineText,
  maybeInsertBlock: maybeInsertBlock,
  maybeUpdateHistory: maybeUpdateHistory,
  maybeUpdateAnnotation: maybeUpdateAnnotation
};