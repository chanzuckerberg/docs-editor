'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteCommentThread;

var _DocsEditorChangeType = require('./DocsEditorChangeType');

var _draftJs = require('draft-js');

// We need this because we don't have explicilt selection needed to clear
// comments.

// https://github.com/thibaudcolas/draftjs-filters/blob/ad9ebbd35c71319d7889da3334e23a37ee973f0f/src/lib/filters/entities.js#L72-L119

function deleteCommentThread(editorState, commentThreadId) {
  var changed = false;
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().map(function (block, key) {
    var charsListChanged = false;
    var charsList = block.getCharacterList().map(function (char) {
      var entityKey = char.getEntity();
      if (!entityKey) {
        return char;
      }
      var entity = contentState.getEntity(entityKey);
      var entityData = entity.getData();
      if (entityData.commentThreadId !== commentThreadId) {
        return char;
      }
      charsListChanged = true;
      changed = true;
      return _draftJs.CharacterMetadata.applyEntity(char, null);
    });

    return charsListChanged ? block.set("characterList", charsList) : block;
  });
  if (!changed) {
    return editorState;
  }
  var contentStateNext = contentState.merge({ blockMap: blockMap });
  return _draftJs.EditorState.push(editorState, contentStateNext, _DocsEditorChangeType.APPLY_ENTITY);
}