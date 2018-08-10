// @flow

import {ContentState, ContentBlock} from 'draft-js';

// Executes a callback for each contiguous range of entities within this
// ContentBlock.
function findEntitiesForType(
  entityType: string,
  contentBlock: ContentBlock,
  callback: Function,
  contentState: ContentState,
): void {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null || entityKey === undefined) {
      return false;
    }
    const entity = contentState.getEntity(entityKey);
    if (!entity) {
      return false;
    }
    return entity.getType() === entityType;
  }, callback);
}

export default findEntitiesForType;
