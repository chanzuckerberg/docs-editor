'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REDO = exports.UNDO = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.BLOCK_QUOTE = exports.ORDERED_LIST = exports.UNORDERED_LIST = exports.HIGHLIGHT = exports.CODE = exports.STRIKE = exports.UNDERLINE = exports.ITALIC = exports.BOLD = exports.LINK = exports.EXPANDABLE = exports.MATH = exports.TABLE = exports.IMAGE = undefined;

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsImageEditor = require('./DocsImageEditor');

var _DocsImageEditor2 = _interopRequireDefault(_DocsImageEditor);

var _DocsMathEditor = require('./DocsMathEditor');

var _DocsMathEditor2 = _interopRequireDefault(_DocsMathEditor);

var _DocsTextInputEditor = require('./DocsTextInputEditor');

var _DocsTextInputEditor2 = _interopRequireDefault(_DocsTextInputEditor);

var _getCurrentSelectionEntity = require('./getCurrentSelectionEntity');

var _getCurrentSelectionEntity2 = _interopRequireDefault(_getCurrentSelectionEntity);

var _showModalDialog = require('./showModalDialog');

var _showModalDialog2 = _interopRequireDefault(_showModalDialog);

var _updateEntityData = require('./updateEntityData');

var _updateEntityData2 = _interopRequireDefault(_updateEntityData);

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

var IMAGE = exports.IMAGE = {
  action: _DocsActionTypes2.default.IMAGE_INSERT,
  icon: 'insert_photo',
  label: 'Insert Image',
  isEnabled: hasNoSelection,
  isActive: returnFalse,
  update: showImageEditorModalDialog
};

var TABLE = exports.TABLE = {
  action: _DocsActionTypes2.default.TABLE_INSERT,
  icon: 'grid_on',
  label: 'Insert Table',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: function update(f, editorState, onChange) {
    return onChange((0, _DocsModifiers.insertTable)(editorState));
  }
};

var MATH = exports.MATH = {
  action: _DocsActionTypes2.default.MATH_INSERT,
  icon: 'functions',
  label: 'Math',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: showMathEditorModalDialog
};

var EXPANDABLE = exports.EXPANDABLE = {
  action: _DocsActionTypes2.default.EXPANDABLE_INSERT,
  icon: 'expand_more',
  label: 'Expandable',
  isActive: returnFalse,
  isEnabled: hasNoSelection,
  update: function update(f, editorState, onChange) {
    return onChange((0, _DocsModifiers.insertExpandable)(editorState));
  }
};

var LINK = exports.LINK = {
  action: _DocsActionTypes2.default.TEXT_LINK,
  icon: 'link',
  label: 'Add link',
  isActive: returnFalse,
  isEnabled: hasSelection,
  update: showLinkEditorModalDialog
};

var BOLD = exports.BOLD = {
  action: _DocsActionTypes2.default.TEXT_B,
  icon: 'format_bold',
  label: 'Bold',
  style: 'BOLD',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle
};

var ITALIC = exports.ITALIC = {
  action: _DocsActionTypes2.default.TEXT_I,
  icon: 'format_italic',
  label: 'Italic',
  style: 'ITALIC',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle
};

var UNDERLINE = exports.UNDERLINE = {
  action: _DocsActionTypes2.default.TEXT_U,
  icon: 'format_underlined',
  label: 'Underline',
  style: 'UNDERLINE',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle
};

var STRIKE = exports.STRIKE = {
  action: _DocsActionTypes2.default.TEXT_STRIKE,
  icon: 'strikethrough_s',
  label: 'Strike',
  style: 'STRIKETHROUGH',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle
};

var CODE = exports.CODE = {
  action: _DocsActionTypes2.default.TEXT_VAR,
  icon: 'code',
  label: 'Code',
  style: 'CODE',
  isActive: hasInlineStyle,
  isEnabled: hasSelection,
  update: toggleInlineStyle
};

var HIGHLIGHT = exports.HIGHLIGHT = {
  action: _DocsActionTypes2.default.TEXT_ANNOTATION,
  icon: 'format_color_text',
  label: 'Highlight',
  isActive: returnFalse,
  isEnabled: hasSelection,
  update: noop
};

var UNORDERED_LIST = exports.UNORDERED_LIST = {
  action: _DocsActionTypes2.default.TEXT_UL,
  icon: 'format_list_bulleted',
  label: 'Unordered List',
  style: 'unordered-list-item',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var ORDERED_LIST = exports.ORDERED_LIST = {
  action: _DocsActionTypes2.default.TEXT_OL,
  icon: 'format_list_numbered',
  label: 'Ordered List',
  style: 'ordered-list-item',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var BLOCK_QUOTE = exports.BLOCK_QUOTE = {
  action: _DocsActionTypes2.default.TEXT_BLOCK_QUOTE,
  icon: 'format_quote',
  label: 'Block Quote',
  style: 'blockquote',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var H1 = exports.H1 = {
  action: _DocsActionTypes2.default.TEXT_H1,
  label: 'H1',
  style: 'header-one',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var H2 = exports.H2 = {
  action: _DocsActionTypes2.default.TEXT_H2,
  label: 'H2',
  style: 'header-two',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var H3 = exports.H3 = {
  action: _DocsActionTypes2.default.TEXT_H3,
  label: 'H3',
  style: 'header-three',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var H4 = exports.H4 = {
  action: _DocsActionTypes2.default.TEXT_H4,
  label: 'H4',
  style: 'header-four',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var H5 = exports.H5 = {
  action: _DocsActionTypes2.default.TEXT_H5,
  label: 'H5',
  style: 'header-five',
  isActive: hasBlockStyle,
  isEnabled: returnTrue,
  update: toggleBlockStyle
};

var UNDO = exports.UNDO = {
  action: _DocsActionTypes2.default.HISTORY_UNDO,
  icon: 'undo',
  label: 'Undo',
  isActive: returnFalse,
  isEnabled: canUndo,
  update: undo
};

var REDO = exports.REDO = {
  action: _DocsActionTypes2.default.HISTORY_UNDO,
  icon: 'redo',
  label: 'Redo',
  isActive: returnFalse,
  isEnabled: canRedo,
  update: redo
};

function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
}

function redo(feature, editorState, onChange) {
  onChange(_draftJs.EditorState.redo(editorState));
}

function undo(feature, editorState, onChange) {
  onChange(_draftJs.EditorState.undo(editorState));
}

function canRedo(feature, editorState) {
  return editorState.getRedoStack().size > 0;
}

function canUndo(feature, editorState) {
  return editorState.getUndoStack().size > 0;
}

function hasBlockStyle(feature, editorState) {
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var contentBlock = contentState.getBlockForKey(selection.getStartKey());
  var blockType = contentBlock ? contentBlock.getType() : null;
  return blockType === feature.style;
}

function hasInlineStyle(feature, editorState) {
  var selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return false;
  }

  var currentStyle = editorState.getCurrentInlineStyle();
  return currentStyle.has(feature.style);
}

function hasSelection(feature, editorState) {
  var selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
}

function hasNoSelection(feature, editorState) {
  var selectionState = editorState.getSelection();
  return selectionState.isCollapsed();
}

function toggleBlockStyle(feature, editorState, onChange, docsContext) {
  onChange(_draftJs.RichUtils.toggleBlockType(editorState, feature.style));
}

function toggleInlineStyle(feature, editorState, onChange, docsContext) {
  onChange(_draftJs.RichUtils.toggleInlineStyle(editorState, feature.style));
}

function noop(feature, editorState, onChange, docsContext) {
  console.log('not supported', feature);
}

// This opens an image editor for the image that was just inserted by user.
function showImageEditorModalDialog(feature, editorState, onChange, docsContext) {
  // TODO:  This creates an extra history entry, fix it.
  var nextEditorState = (0, _DocsModifiers.insertImage)(editorState);
  var contentState = nextEditorState.getCurrentContent();
  var entityKey = contentState.getLastCreatedEntityKey();
  var entity = contentState.getEntity(entityKey);
  var entityData = entity.getData();
  return (0, _showModalDialog2.default)(_DocsImageEditor2.default, {
    docsContext: docsContext,
    entityData: entityData,
    title: 'Edit Image'
  }, function (newEntityData) {
    if (newEntityData) {
      onChange((0, _updateEntityData2.default)(nextEditorState, entityKey, newEntityData));
    }
  });
}

function showLinkEditorModalDialog(feature, editorState, onChange, docsContext) {
  var linkEntity = (0, _getCurrentSelectionEntity2.default)(editorState);
  var currentURL = linkEntity && linkEntity.getData().url || '';
  return (0, _showModalDialog2.default)(_DocsTextInputEditor2.default, {
    title: 'Enter link URL or leave it empty to remove the link',
    value: currentURL
  }, function (newURL) {
    if (newURL === undefined) {
      // Action was cancelled.
      return;
    }
    onChange((0, _DocsModifiers.updateLink)(editorState, newURL || null));
  });
}

// This opens an math editor for the math placeholder that was just inserted by
// user.
function showMathEditorModalDialog(feature, editorState, onChange, docsContext) {
  // TODO:  This creates an extra history entry, fix it.
  var nextEditorState = (0, _DocsModifiers.insertMath)(editorState);
  var contentState = nextEditorState.getCurrentContent();
  var entityKey = contentState.getLastCreatedEntityKey();
  var entity = contentState.getEntity(entityKey);
  var entityData = entity.getData();
  return (0, _showModalDialog2.default)(_DocsMathEditor2.default, {
    docsContext: docsContext,
    entityData: entityData
  }, function (newEntityData) {
    if (!newEntityData) {
      // Action was cancelled.
      return;
    }
    onChange((0, _updateEntityData2.default)(nextEditorState, entityKey, newEntityData));
  });
}