// @flow

import DocsBlockTypeToComponent from './DocsBlockTypeToComponent';
import DocsBlockTypes from './DocsBlockTypes';
import DocsDecorator from './DocsDecorator';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import adjustBlockDepthForContentState from './adjustBlockDepthForContentState';
import convertFromHTML from './convertFromHTML';
import convertFromRaw from './convertFromRaw';
import convertToRaw from './convertToRaw';
import getCurrentSelectionEntity from './getCurrentSelectionEntity';
import isContentBlockEmpty from './isContentBlockEmpty';
import tryInsertAtomicBlock from './tryInsertAtomicBlock';
import uniqueID from './uniqueID';
import updateEntityData from './updateEntityData';
import {ADJUST_DEPTH, APPLY_ENTITY, CHANGE_BLOCK_DATA} from './DocsEditorChangeType';
import {DOCS_INDENTED_BLOCK} from './DocsBlockTypes';
import {List, Map as ImmutableMap, OrderedMap, Repeat} from 'immutable';
import {genKey, CharacterMetadata, ContentBlock, Modifier, EditorState, SelectionState, RichUtils} from 'draft-js';

const CHAR_ZERO_WIDTH = '\u200B';
const MAX_DEPTH = 8;

// All the modifiers in this file muss have the same interface like this:
//   `function modifyXY(editorState: EditorState, ...rest): EditorState {}``

function updateIndent(editorState: EditorState, adjustment: number): EditorState {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = editorState.getSelection().getStartKey();
  const startOffset = editorState.getSelection().getStartOffset();
  const block = contentState.getBlockForKey(startKey);
  const blockType = block.getType();
  if (
    blockType === 'unordered-list-item' ||
    blockType === 'ordered-list-item'
  ) {
    const nextContentState = adjustBlockDepthForContentState(
      contentState,
      selectionState,
      adjustment,
      4,
    );
    return EditorState.push(
      editorState,
      nextContentState,
      ADJUST_DEPTH,
    );
  } else if (blockType === 'unstyled') {
    const nextContentState = adjustBlockDepthForContentState(
      contentState,
      selectionState,
      adjustment,
      MAX_DEPTH,
    );
    return EditorState.push(
      editorState,
      nextContentState,
      ADJUST_DEPTH,
    );
  }

  return editorState;
}

function indentMore(editorState: EditorState): EditorState {
  return updateIndent(editorState, 1);
}

function indentLess(editorState: EditorState): EditorState {
  return updateIndent(editorState, -1);
}

function insertTable(editorState: EditorState): EditorState {
  return insertCustomBlock(
    editorState,
    DocsBlockTypes.DOCS_TABLE,
    {rowsCount: 2, colsCount: 2, topRowBgStyle: 'dark'},
  );
}

function insertExpandable(editorState: EditorState): EditorState {
  return insertCustomBlock(
    editorState,
    DocsBlockTypes.DOCS_EXPANDABLE,
    {
      show: true,
      showLabel: '',
      hideLabel: '',
      body: '',
    },
  );
}

function insertMath(editorState: EditorState): EditorState {
  // See https://github.com/FB-PLP/react-math-input-app
  const entityData = {};
  return insertDecorator(
    editorState,
    DocsDecoratorTypes.DOCS_MATH,
    true,
    entityData,
    true,
  );
}

function insertImage(editorState: EditorState): EditorState {
  return insertDecorator(
    editorState,
    DocsDecoratorTypes.DOCS_IMAGE,
    true,
    {
      url: null,
    },
    true,
  );
}

function insertDecorator(
  editorState: EditorState,
  decoratorType: string,
  immutable: boolean,
  rawEntityData: Object,
  addExtraSpace?: boolean,
): EditorState {
  // See https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/modifiers/addEmoji.js
  const currentSelectionState = editorState.getSelection();
  if (!currentSelectionState.isCollapsed()) {
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    decoratorType,
    immutable ? 'IMMUTABLE' : 'MUTABLE',
    rawEntityData,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const afterRemovalContentState = Modifier.removeRange(
    contentState,
    currentSelectionState,
    'backward',
  );
  // deciding on the position to insert.
  const targetSelection = afterRemovalContentState.getSelectionAfter();

  // Add an invisible space before the component so that it can be selectable.
  let newContentState = Modifier.insertText(
    afterRemovalContentState,
    targetSelection,
    ' ',
    null,
    null,
  );

  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    CHAR_ZERO_WIDTH,
    null,
    entityKey,
  );
  const targetSelectionEnd = targetSelection.getAnchorOffset();
  const blockKey = targetSelection.getAnchorKey();
  const blockSize = contentState.getBlockForKey(blockKey).getLength();
  if (targetSelectionEnd === blockSize) {
    // If it is inserted at the end, a space is appended right after for
    // a smooth writing experience.
    newContentState = Modifier.insertText(
      newContentState,
      newContentState.getSelectionAfter(),
      ' ',
    );
  }
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-' + decoratorType,
  );
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
}

function moveSelectionToEnd(editorState: EditorState): EditorState {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();

  const key = blockMap.last().getKey();
  const length = blockMap.last().getLength();

  const selection = new SelectionState({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  });

  return EditorState.forceSelection(editorState, selection);
}

function insertCustomBlock(
  editorState: EditorState,
  blockType: string,
  entityData: Object,
): EditorState {
  const Component = DocsBlockTypeToComponent.getComponent(blockType);

  if (!Component) {
    console.warn('No Component registered for custom block $s', blockType);
    return editorState;
  }

  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    blockType,
    'IMMUTABLE',
    entityData,
  );

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(
    editorState,
    {currentContent: contentStateWithEntity, decorator: DocsDecorator.get()},
  );
  return tryInsertAtomicBlock(newEditorState, entityKey, ' ') || editorState;
}

function updateLink(
  editorState: EditorState,
  url: ?string,
): EditorState {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    DocsDecoratorTypes.LINK,
    'MUTABLE',
    {url},
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return RichUtils.toggleLink(
    editorState,
    selection,
    url ? entityKey : null,
  );
}

function toggleAnnotation(
  editorState: EditorState,
): EditorState {
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    return editorState;
  }
  const currentEntity = getCurrentSelectionEntity(editorState);
  if (currentEntity) {
    // TODO: It should not clear the whole entity, but only the selection
    // part.
    const contentState = editorState.getCurrentContent();
    const entityKey = null;
    const newContentState = Modifier.applyEntity(
      contentState,
      selection,
      entityKey,
    );
    return EditorState.push(editorState, newContentState, APPLY_ENTITY);
  } else {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      DocsDecoratorTypes.DOCS_ANNOTATION,
      'MUTABLE',
      {
        color: 'yellow',
        token: uniqueID(),
      },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.applyEntity(
      contentStateWithEntity,
      selection,
      entityKey,
    );
    return EditorState.push(editorState, newContentState, APPLY_ENTITY);
  }
}

// Copied from https://stackoverflow.com/questions/41193914
function insertBlock(
  editorState: EditorState,
  contentBlock: ?ContentBlock,
  direction: string,
): EditorState {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = contentBlock ?
    contentBlock :
    contentState.getBlockForKey(selection.getEndKey());

  const blockMap = contentState.getBlockMap();

  // Split the blocks.
  const currentBlockKey = currentBlock.getKey();
  const finder = (v => v === currentBlock);
  const blocksBefore = blockMap.toSeq().takeUntil(finder);
  const blocksAfter = blockMap.toSeq().skipUntil(finder).rest();
  const newBlock = createContentBlock('');
  const newBlockKey = genKey();
  let newBlocks;
  if (direction === 'before') {
    newBlocks = [
      [newBlockKey, newBlock],
      [currentBlockKey, currentBlock],
    ];
  } else {
    newBlocks = [
      [currentBlockKey, currentBlock],
      [newBlockKey, newBlock],
    ];
  }
  const newBlockMap =
    blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap();
  const newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection,
  });
  return EditorState.push(editorState, newContentState, CHANGE_BLOCK_DATA);
}

// BUGGY!!
// function removeBlock(
//   editorState: EditorState,
//   contentBlock: ContentBlock,
// ): EditorState {
//   // See https://github.com/facebook/draft-js/issues/915
//   // https://stackoverflow.com/questions/43991042/how-to-select-and-remove-an-atomic-block
//   // https://github.com/facebook/draft-js/issues/554
//   const key = contentBlock.getKey();
//   const selection = SelectionState.createEmpty(key).merge({
//     focusOffset: contentBlock.getText().length,
//   });
//   const contentState = editorState.getCurrentContent();
//   const newContentState = Modifier.removeRange(
//     contentState,
//     selection,
//     'forward',
//   );
//   // TODO: Need to force the selection to the end of the previous block.
//   // TODO: Clear entity data.
//   return EditorState.push(editorState, newContentState, 'remove-range');
// }

function updateBlockStyle(
  editorState: EditorState,
  contentBlock: ContentBlock,
  className: string,
): EditorState {
  const contentState = editorState.getCurrentContent();
  const key = contentBlock.getKey();
  const newSelection = SelectionState.createEmpty(key).merge({
    focusOffset: contentBlock.getText().length,
  });
  const newBlockData = contentBlock.getData().merge({
    className,
  });
  const newContentState = Modifier.mergeBlockData(
    contentState,
    newSelection,
    newBlockData,
  );
  return EditorState.push(editorState, newContentState, APPLY_ENTITY);
}

function ensureAtomicBlocksAreSelectable(
  editorState: EditorState,
): EditorState {
  // If editor start with atomic block, user won't be able to select
  // and delete that atomic block. The workaround is to surround it with blank
  // blocks. See https://github.com/facebook/draft-js/issues/327
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  let newBlockMap = (new OrderedMap()).withMutations((mutableBlock) => {
    const blocks = blockMap.toArray();
    blocks.forEach((block, ii) => {
      if (block.getType() !== 'atomic') {
        mutableBlock.set(block.getKey(), block);
        return;
      }
      maybeInsertSiblingBlock(
        blocks[ii - 1],
        block,
        true,
        mutableBlock,
      );
      maybeInsertSiblingBlock(
        blocks[ii + 1],
        block,
        false,
        mutableBlock,
      );
    });
  });

  if (
    newBlockMap.size ===  blockMap.size &&
    newBlockMap.first() ===  blockMap.first() &&
    newBlockMap.last() ===  blockMap.last()
  ) {
    // Nothing was added.
    return editorState;
  }

  // Strip the leading and tailing empty blocks.
  const shouldStripEndingEmptyBLocks = false;
  if (shouldStripEndingEmptyBLocks) {
    newBlockMap = newBlockMap.withMutations((mutableBlock) => {
      maybeStripBlock(mutableBlock.first(), mutableBlock);
      maybeStripBlock(mutableBlock.last(), mutableBlock);
    });
  }

  const selection = editorState.getSelection();
  const newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection,
  });
  const decorator = DocsDecorator.get();
  return EditorState.createWithContent(newContentState, decorator);
}

function pasteHTML(
  editorState: EditorState,
  html: string,
): EditorState {
  return convertFromHTML(html, editorState, null, null, true);
}

// Helper function for `ensureAtomicBlocksAreSelectable()`.
function maybeStripBlock(
  block: ?ContentBlock,
  blockMap: OrderedMap<string, ContentBlock>,
): void {
  if (
    !block ||
    block.getType() !== 'unstyled' ||
    block.getText() ||
    block.getData().get('className')
  ) {
    return;
  }
  blockMap.delete(block.getKey());
}

// Helper function for `ensureAtomicBlocksAreSelectable()`.
function maybeInsertSiblingBlock(
  siblingBlock: ?ContentBlock,
  currentBlock: ContentBlock,
  before: boolean,
  blockMap: OrderedMap<string, ContentBlock>,
): void {

  if (siblingBlock && isContentBlockEmpty(siblingBlock)) {
    // No need to inject extra blank line since siblingBlock is already empty.
    blockMap.set(currentBlock.getKey(), currentBlock);
    return;
  }

  const className = before ?
    'docs-before-atomic-block' :
    'docs-after-atomic-block';

  if (
    !siblingBlock ||
    siblingBlock.getData().get('className') !== className
  ) {
    const newBlock = createContentBlock('', className);
    if (before) {
      if (siblingBlock) {
        blockMap.set(siblingBlock.getKey(), siblingBlock);
      }
      blockMap.set(newBlock.getKey(), newBlock);
      blockMap.set(currentBlock.getKey(), currentBlock);
    } else {
      blockMap.set(currentBlock.getKey(), currentBlock);
      blockMap.set(newBlock.getKey(), newBlock);
      if (siblingBlock) {
        blockMap.set(siblingBlock.getKey(), siblingBlock);
      }
    }
  } else {
    blockMap.set(currentBlock.getKey(), currentBlock);
  }
}

// Helper function for `ensureAtomicBlocksAreSelectable()`.
function createContentBlock(text: string, className?: string): ContentBlock {
  const characterList = List(
    Repeat(CharacterMetadata.EMPTY, text.length),
  );
  return new ContentBlock({
    key: genKey(),
    type: 'unstyled',
    text,
    characterList,
    data: className ? ImmutableMap({className}) : undefined,
  });
}

module.exports = {
  ensureAtomicBlocksAreSelectable,
  indentLess,
  indentMore,
  insertBlock,
  insertCustomBlock,
  insertExpandable,
  insertImage,
  insertMath,
  insertTable,
  moveSelectionToEnd,
  pasteHTML,
  toggleAnnotation,
  updateBlockStyle,
  updateEntityData,
  updateLink,
};
