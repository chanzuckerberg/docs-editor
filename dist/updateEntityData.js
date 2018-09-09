'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DocsDecorator = require('./DocsDecorator');

var _DocsDecorator2 = _interopRequireDefault(_DocsDecorator);

var _draftJs = require('draft-js');

var _DocsEditorChangeType = require('./DocsEditorChangeType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEntityData(editorState, entityKey, entityData) {
  // calling `contentState.replaceEntityData` mutates the linked enity data
  // that is mutable directly.
  var contentState = editorState.getCurrentContent();
  contentState.replaceEntityData(entityKey, entityData);
  return _draftJs.EditorState.createWithContent(contentState, _DocsDecorator2.default.get());
}

function updateContentBlockEntityData(editorState, entityKey, entityData, contentBlock, anchorOffset) {
  var contentBlockKey = contentBlock.getKey();
  // Create a fake selection to that we can update the entity data
  // with `Modifier.applyEntity.`
  var selection = editorState.getSelection().merge({
    focusKey: contentBlockKey,
    anchorKey: contentBlockKey,
    anchorOffset: anchorOffset,
    focusOffset: anchorOffset + 1,
    isBackward: false,
    hasFocus: false
  });

  var contentState = editorState.getCurrentContent();
  var entity = contentState.getEntity(entityKey);
  if (!entity) {
    // Warning: It should not end here.
    return editorState;
  }

  // Remove the old entity.
  contentState = _draftJs.Modifier.applyEntity(contentState, selection, null);

  // Create a new entity.
  contentState = contentState.createEntity(entity.getType(), entity.getMutability(), entityData);

  contentState = _draftJs.Modifier.applyEntity(contentState, selection, contentState.getLastCreatedEntityKey());

  return _draftJs.EditorState.push(editorState, contentState, _DocsEditorChangeType.APPLY_ENTITY);
}

function updateEntityData(editorState, entityKey, entityData) {
  var contentState = editorState.getCurrentContent();
  var contentEntity = contentState.getEntity(entityKey);
  if (!contentEntity) {
    return createEntityData(editorState, entityKey, entityData);
  }

  var blocks = contentState.getBlocksAsArray();
  for (var ii = 0, jj = blocks.length; ii < jj; ii++) {
    var contentBlock = blocks[ii];
    var contentLength = contentBlock.getLength();
    for (var kk = 0; kk < contentLength; kk++) {
      var entity = contentBlock.getEntityAt(kk);
      if (entity === entityKey) {
        return updateContentBlockEntityData(editorState, entityKey, entityData, contentBlock, kk);
      }
    }
  }

  return editorState;
}

exports.default = updateEntityData;