// @flow

import {ContentState, SelectionState} from 'draft-js';

// Forked from `draft-js` since `draft-js` does not export it.
// See https://github.com/facebook/draft-js/issues/187

function adjustBlockDepthForContentState(
  contentState: ContentState,
  selectionState: SelectionState,
  adjustment: number,
  maxDepth: number,
): ContentState {
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  let blockMap = contentState.getBlockMap();
  const blocks = blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]])
    .map(block => {
      let depth = block.getDepth() + adjustment;
      depth = Math.max(0, Math.min(depth, maxDepth));
      return block.set('depth', depth);
    });

  blockMap = blockMap.merge(blocks);

  return contentState.merge({
    blockMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  });
}

export default adjustBlockDepthForContentState;
