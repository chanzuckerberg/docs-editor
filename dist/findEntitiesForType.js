'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

// Executes a callback for each contiguous range of entities within this
// ContentBlock.
function findEntitiesForType(entityType, contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    if (entityKey === null || entityKey === undefined) {
      return false;
    }
    var entity = contentState.getEntity(entityKey);
    if (!entity) {
      return false;
    }
    return entity.getType() === entityType;
  }, callback);
}

exports.default = findEntitiesForType;