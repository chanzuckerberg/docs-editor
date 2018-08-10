// @flow

import warn from './warn';
import {ContentState, Entity} from 'draft-js';

// Core helper function.
// Do not require any Component or Modifier in this file to avoid circular
// dependiencies.

function tryGetEntityAtContentState(
  contentState: ContentState,
  entityKey: string,
): ?Entity {
  try {
    return contentState.getEntity(entityKey);
  } catch(ex) {
    // entity was removed, we should clean up `contentState` later.
    warn(ex);
    return null;
  }
}

export default tryGetEntityAtContentState;
