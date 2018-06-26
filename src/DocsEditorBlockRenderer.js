// @flow

import DocsBlockTypeToComponent from './DocsBlockTypeToComponent';
import {ContentBlock, EditorState, DefaultDraftBlockRenderMap} from 'draft-js';
import {Map as ImmutableMap} from 'immutable';
import {tryGetEntityAtContentState} from './DocsHelpers';

type Props = {
  onChange: (s: EditorState) => void,
  editorState: EditorState,
};

function renderBlock(
  contentBlock: ContentBlock,
  blockProps: Props,
) {
  const blockType = contentBlock.getType();
  if (blockType !== 'atomic') {
    return null;
  }
  const entityKey = contentBlock.getEntityAt(0);
  const contentState = blockProps.editorState.getCurrentContent();
  const entity = entityKey ?
    tryGetEntityAtContentState(contentState, entityKey) :
    null;
  if (!entity) {
    // This happens while pasting HTML from external sources and we failed
    // to parse its data.
    return null;
  }
  const type = entity.getType();
  const Component = DocsBlockTypeToComponent.getComponent(type);
  if (Component) {
    return {
      component: Component,
      editable: false,
      props: {
        ...blockProps,
        entity,
        entityKey,
      },
    };
  }
  return null;
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

function getBlockRenderMap(): ImmutableMap<any> {
  return DefaultDraftBlockRenderMap.set('paragraph', {element: 'p'});
}

module.exports = {
  getBlockRenderMap,
  getStyle,
  renderBlock,
};
