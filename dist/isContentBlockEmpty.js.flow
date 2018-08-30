// @flow

import {ContentBlock} from 'draft-js';

export default function isContentBlockEmpty(
  contentBlock: ContentBlock,
): boolean {
  return (
    contentBlock.getType() === 'unstyled' &&
    contentBlock.getText() === '' &&
    contentBlock.getDepth() === 0 &&
    contentBlock.getData() &&
    contentBlock.getData().get('className') === undefined
  );
}
