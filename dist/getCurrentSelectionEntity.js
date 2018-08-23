'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

var _tryGetEntityAtContentState = require('./tryGetEntityAtContentState');

var _tryGetEntityAtContentState2 = _interopRequireDefault(_tryGetEntityAtContentState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCurrentSelectionEntity(editorState) {
  var selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return null;
  }
  var contentState = editorState.getCurrentContent();
  var startKey = editorState.getSelection().getStartKey();
  var startOffset = editorState.getSelection().getStartOffset();
  var blockWithEntityAtBeginning = contentState.getBlockForKey(startKey);
  if (!blockWithEntityAtBeginning) {
    return null;
  }
  var entityKey = blockWithEntityAtBeginning.getEntityAt(startOffset);
  if (!entityKey) {
    return null;
  }
  return (0, _tryGetEntityAtContentState2.default)(contentState, entityKey);
}

exports.default = getCurrentSelectionEntity;