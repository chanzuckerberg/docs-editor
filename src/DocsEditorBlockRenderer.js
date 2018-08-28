// @flow

import DocsBlockTypeToComponent from './DocsBlockTypeToComponent';
import DocsList from './DocsList';
import React from 'react';
import tryGetEntityAtContentState from './tryGetEntityAtContentState';
import {ContentBlock, EditorState, DefaultDraftBlockRenderMap} from 'draft-js';
import {Map as ImmutableMap} from 'immutable';

type Props = {
  onChange: (s: EditorState) => void,
  editorState: EditorState,
};

// Copied from https://github.com/facebook/draft-js/blob/master/src/model/constants/DraftBlockType.js#L27-L28
const UNORDERED_LIST_ITEM = 'unordered-list-item'
const ORDERED_LIST_ITEM = 'ordered-list-item'
const PARAGRAPH = 'paragraph';

function renderBlock(
  contentBlock: ContentBlock,
  blockProps: Props,
) {

  let component;
  let props;
  let editable;

  switch (contentBlock.getType()) {
    case 'atomic' :
      const contentState = blockProps.editorState.getCurrentContent();
      const entityKey = contentBlock.getEntityAt(0);
      // entity could be `null`.
      // This happens while pasting HTML from external sources and we failed
      // to parse its data.
      const entity = entityKey ?
        tryGetEntityAtContentState(contentState, entityKey) :
        null;
      if (entity) {
        component = DocsBlockTypeToComponent.getComponent(entity.getType());
        editable = false;
        props = {
          ...blockProps,
          entity,
          entityKey,
        };
      }
      break;

    // case UNORDERED_LIST_ITEM:
    // case ORDERED_LIST_ITEM:
    //   component = DocsList.Item;
    //   props = blockProps;
    //   break;

    default:
      return null;
  }

  if (!component) {
    return null;
  }

  return {
    component,
    editable,
    props,
  };
}

function getStyle(
  contentBlock: ContentBlock,
): ?string {
    // => Map
  const classNames = [];

  const blockData = contentBlock.getData();

  // This handles in-editor changes. (e.g. Toggle alignment).
  if (blockData && blockData.has('className')) {
    classNames.push(blockData.get('className'));
  }

  // => OrderedSet
  // This handles pasted style.
  const inlineStyleSet = contentBlock.getInlineStyleAt(0);
  if (inlineStyleSet && inlineStyleSet.size > 0) {
    classNames.push.apply(classNames, inlineStyleSet.toArray());
  }

  return classNames.length ? classNames.join(' ') : null;
}


// https://github.com/facebook/draft-js/blob/0.10-stable/src/model/immutable/DefaultDraftBlockRenderMap.js#L22
// https://github.com/facebook/draft-js/issues/1497

const BLOCK_RENDER_MAP = DefaultDraftBlockRenderMap.merge(ImmutableMap({
  [PARAGRAPH]: {element: 'p'},
  // [UNORDERED_LIST_ITEM]: {
  //   element: 'li',
  //   wrapper: <DocsList.Unordered />,
  // },
  // [ORDERED_LIST_ITEM]: {
  //   element: 'li',
  //   wrapper: <DocsList.Ordered />,
  // },
}));

function getBlockRenderMap(): ImmutableMap<any> {
  return BLOCK_RENDER_MAP;
}

module.exports = {
  getBlockRenderMap,
  getStyle,
  renderBlock,
};
