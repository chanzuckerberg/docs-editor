'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REDO = exports.UNDO = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.BLOCK_QUOTE = exports.INDENT_LESS = exports.INDENT_MORE = exports.ORDERED_LIST = exports.UNORDERED_LIST = exports.HIGHLIGHT = exports.CODE = exports.STRIKE = exports.UNDERLINE = exports.ITALIC = exports.BOLD = exports.LINK = exports.EXPANDABLE = exports.MATH = exports.TABLE = exports.IMAGE = exports.HTML_DOCUMENT = exports.CALCULATOR = undefined;

var _CalculatorBehavior = require('./CalculatorBehavior');

var _CalculatorBehavior2 = _interopRequireDefault(_CalculatorBehavior);

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

var _HTMLDocumentBehavior = require('./HTMLDocumentBehavior');

var _HTMLDocumentBehavior2 = _interopRequireDefault(_HTMLDocumentBehavior);

var _getCurrentSelectionEntity = require('./getCurrentSelectionEntity');

var _getCurrentSelectionEntity2 = _interopRequireDefault(_getCurrentSelectionEntity);

var _hasNoSelection = require('./hasNoSelection');

var _hasNoSelection2 = _interopRequireDefault(_hasNoSelection);

var _hasSelection = require('./hasSelection');

var _hasSelection2 = _interopRequireDefault(_hasSelection);

var _returnFalse = require('./returnFalse');

var _returnFalse2 = _interopRequireDefault(_returnFalse);

var _returnTrue = require('./returnTrue');

var _returnTrue2 = _interopRequireDefault(_returnTrue);

var _showModalDialog = require('./showModalDialog');

var _showModalDialog2 = _interopRequireDefault(_showModalDialog);

var _updateEntityData = require('./updateEntityData');

var _updateEntityData2 = _interopRequireDefault(_updateEntityData);

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

// List item depths limited to 4.
// https://github.com/facebook/draft-js/issues/122
var MAX_DEPTH = 4;
var MIN_DEPTH = 0;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsBehavior', {
  value: require('prop-types').shape({
    action: require('prop-types').string.isRequired,
    icon: require('prop-types').string,
    isActive: require('prop-types').func.isRequired,
    isEnabled: require('prop-types').func.isRequired,
    label: require('prop-types').string.isRequired,
    update: require('prop-types').func.isRequired
  })
});
var CALCULATOR = exports.CALCULATOR = new _CalculatorBehavior2.default();

var HTML_DOCUMENT = exports.HTML_DOCUMENT = new _HTMLDocumentBehavior2.default();

var IMAGE = exports.IMAGE = {
  action: _DocsActionTypes2.default.IMAGE_INSERT,
  icon: 'insert_photo',
  label: 'Insert Image',
  isEnabled: _hasNoSelection2.default,
  isActive: _returnFalse2.default,
  update: showImageEditorModalDialog
};

var TABLE = exports.TABLE = {
  action: _DocsActionTypes2.default.TABLE_INSERT,
  icon: 'grid_on',
  label: 'Insert Table',
  isActive: _returnFalse2.default,
  isEnabled: _hasNoSelection2.default,
  update: function update(editorState, onChange) {
    return onChange((0, _DocsModifiers.insertTable)(editorState));
  }
};

var MATH = exports.MATH = {
  action: _DocsActionTypes2.default.MATH_INSERT,
  icon: 'functions',
  label: 'Math',
  isActive: _returnFalse2.default,
  isEnabled: _hasNoSelection2.default,
  update: showMathEditorModalDialog
};

var EXPANDABLE = exports.EXPANDABLE = {
  action: _DocsActionTypes2.default.EXPANDABLE_INSERT,
  icon: 'expand_more',
  label: 'Expandable',
  isActive: _returnFalse2.default,
  isEnabled: _hasNoSelection2.default,
  update: function update(editorState, onChange) {
    return onChange((0, _DocsModifiers.insertExpandable)(editorState));
  }
};

var LINK = exports.LINK = {
  action: _DocsActionTypes2.default.TEXT_LINK,
  icon: 'link',
  label: 'Add link',
  isActive: function isActive(editorState) {
    return _draftJs.RichUtils.currentBlockContainsLink(editorState);
  },
  isEnabled: _hasSelection2.default,
  update: showLinkEditorModalDialog
};

var BOLD = exports.BOLD = {
  action: _DocsActionTypes2.default.TEXT_B,
  icon: 'format_bold',
  label: 'Bold',
  isActive: function isActive(e) {
    return isInlineStyle('BOLD', e);
  },
  isEnabled: _hasSelection2.default,
  update: function update(e, o, d) {
    return toggleInlineStyle('BOLD', e, o, d);
  }
};

var ITALIC = exports.ITALIC = {
  action: _DocsActionTypes2.default.TEXT_I,
  icon: 'format_italic',
  label: 'Italic',
  style: 'ITALIC',
  isActive: function isActive(e) {
    return isInlineStyle('ITALIC', e);
  },
  isEnabled: _hasSelection2.default,
  update: function update(e, o, d) {
    return toggleInlineStyle('ITALIC', e, o, d);
  }
};

var UNDERLINE = exports.UNDERLINE = {
  action: _DocsActionTypes2.default.TEXT_U,
  icon: 'format_underlined',
  label: 'Underline',
  isActive: function isActive(e) {
    return isInlineStyle('UNDERLINE', e);
  },
  isEnabled: _hasSelection2.default,
  update: function update(e, o, d) {
    return toggleInlineStyle('UNDERLINE', e, o, d);
  }
};

var STRIKE = exports.STRIKE = {
  action: _DocsActionTypes2.default.TEXT_STRIKE,
  icon: 'strikethrough_s',
  label: 'Strike',
  isActive: function isActive(e) {
    return isInlineStyle('STRIKETHROUGH', e);
  },
  isEnabled: _hasSelection2.default,
  update: function update(e, o, d) {
    return toggleInlineStyle('STRIKETHROUGH', e, o, d);
  }
};

var CODE = exports.CODE = {
  action: _DocsActionTypes2.default.TEXT_VAR,
  icon: 'code',
  label: 'Code',
  isActive: function isActive(e) {
    return isInlineStyle('CODE', e);
  },
  isEnabled: _hasSelection2.default,
  update: function update(e, o, d) {
    return toggleInlineStyle('CODE', e, o, d);
  }
};

var HIGHLIGHT = exports.HIGHLIGHT = {
  action: _DocsActionTypes2.default.TEXT_HIGHLIGHT,
  icon: 'format_color_text',
  label: 'Highlight',
  isActive: _returnFalse2.default,
  isEnabled: _hasSelection2.default,
  update: noop
};

var UNORDERED_LIST = exports.UNORDERED_LIST = {
  action: _DocsActionTypes2.default.TEXT_UL,
  icon: 'format_list_bulleted',
  label: 'Unordered List',
  isActive: function isActive(e) {
    return isBlockType('unordered-list-item', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('unordered-list-item', e, o, d);
  }
};

var ORDERED_LIST = exports.ORDERED_LIST = {
  action: _DocsActionTypes2.default.TEXT_OL,
  icon: 'format_list_numbered',
  label: 'Ordered List',
  isActive: function isActive(e) {
    return isBlockType('ordered-list-item', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('ordered-list-item', e, o, d);
  }
};

var INDENT_MORE = exports.INDENT_MORE = {
  action: _DocsActionTypes2.default.INDENT_MORE,
  icon: 'format_indent_increase',
  label: 'Indent More',
  isActive: _returnFalse2.default,
  isEnabled: function isEnabled(e) {
    return isIndentable(1, e);
  },
  update: function update(editorState, onChange) {
    return onChange((0, _DocsModifiers.indentMore)(editorState));
  }
};

var INDENT_LESS = exports.INDENT_LESS = {
  action: _DocsActionTypes2.default.INDENT_LESS,
  icon: 'format_indent_decrease',
  label: 'Indent Less',
  isActive: _returnFalse2.default,
  isEnabled: function isEnabled(e) {
    return isIndentable(-1, e);
  },
  update: function update(editorState, onChange) {
    return onChange((0, _DocsModifiers.indentLess)(editorState));
  }
};

var BLOCK_QUOTE = exports.BLOCK_QUOTE = {
  action: _DocsActionTypes2.default.TEXT_BLOCK_QUOTE,
  icon: 'format_quote',
  label: 'Block Quote',
  isActive: function isActive(e) {
    return isBlockType('blockquote', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('blockquote', e, o, d);
  }
};

var H1 = exports.H1 = {
  action: _DocsActionTypes2.default.TEXT_H1,
  label: 'H1',
  isActive: function isActive(e) {
    return isBlockType('header-one', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('header-one', e, o, d);
  }
};

var H2 = exports.H2 = {
  action: _DocsActionTypes2.default.TEXT_H2,
  label: 'H2',
  isActive: function isActive(e) {
    return isBlockType('header-two', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('header-two', e, o, d);
  }
};

var H3 = exports.H3 = {
  action: _DocsActionTypes2.default.TEXT_H3,
  label: 'H3',
  isActive: function isActive(e) {
    return isBlockType('header-three', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('header-three', e, o, d);
  }
};

var H4 = exports.H4 = {
  action: _DocsActionTypes2.default.TEXT_H4,
  label: 'H4',
  isActive: function isActive(e) {
    return isBlockType('header-four', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('header-four', e, o, d);
  }
};

var H5 = exports.H5 = {
  action: _DocsActionTypes2.default.TEXT_H5,
  label: 'H5',
  style: 'header-five',
  isActive: function isActive(e) {
    return isBlockType('header-five', e);
  },
  isEnabled: _returnTrue2.default,
  update: function update(e, o, d) {
    return toggleBlockType('header-five', e, o, d);
  }
};

var UNDO = exports.UNDO = {
  action: _DocsActionTypes2.default.HISTORY_UNDO,
  icon: 'undo',
  label: 'Undo',
  isActive: _returnFalse2.default,
  isEnabled: canUndo,
  update: undo
};

var REDO = exports.REDO = {
  action: _DocsActionTypes2.default.HISTORY_UNDO,
  icon: 'redo',
  label: 'Redo',
  isActive: _returnFalse2.default,
  isEnabled: canRedo,
  update: redo
};

function redo(editorState, onChange) {
  onChange(_draftJs.EditorState.redo(editorState));
}

function undo(editorState, onChange) {
  onChange(_draftJs.EditorState.undo(editorState));
}

function canRedo(editorState) {
  return editorState.getRedoStack().size > 0;
}

function canUndo(editorState) {
  return editorState.getUndoStack().size > 0;
}

function isBlockType(type, editorState) {
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var contentBlock = contentState.getBlockForKey(selection.getStartKey());
  var blockType = contentBlock ? contentBlock.getType() : null;
  return blockType === type;
}

function isIndentable(adjustment, editorState) {
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var contentBlock = contentState.getBlockForKey(selection.getStartKey());
  var blockType = contentBlock ? contentBlock.getType() : null;

  if (blockType !== 'unordered-list-item' && blockType !== 'ordered-list-item') {
    return false;
  }
  var depth = contentBlock ? contentBlock.getDepth() : 0;
  if (adjustment > 0) {
    return depth + adjustment <= MAX_DEPTH;
  } else if (adjustment < 0) {
    return depth + adjustment >= MIN_DEPTH;
  } else {
    return false;
  }
}

function isInlineStyle(style, editorState) {
  var selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return false;
  }

  var currentStyle = editorState.getCurrentInlineStyle();
  return currentStyle.has(style);
}

function toggleBlockType(blockType, editorState, onChange, docsContext) {
  onChange(_draftJs.RichUtils.toggleBlockType(editorState, blockType));
}

function toggleInlineStyle(style, editorState, onChange, docsContext) {
  onChange(_draftJs.RichUtils.toggleInlineStyle(editorState, style));
}

function noop(editorState, onChange, docsContext) {
  console.log('not supported');
}

// This opens an image editor for the image that was just inserted by user.
function showImageEditorModalDialog(editorState, onChange, docsContext) {
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

function showLinkEditorModalDialog(editorState, onChange, docsContext) {
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
function showMathEditorModalDialog(editorState, onChange, docsContext) {
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