'use strict';

var _DocsBlockTypeToComponent = require('./DocsBlockTypeToComponent');

var _DocsBlockTypeToComponent2 = _interopRequireDefault(_DocsBlockTypeToComponent);

var _DocsBlockTypes = require('./DocsBlockTypes');

var _DocsBlockTypes2 = _interopRequireDefault(_DocsBlockTypes);

var _DocsDecorator = require('./DocsDecorator');

var _DocsDecorator2 = _interopRequireDefault(_DocsDecorator);

var _DocsDecoratorTypes = require('./DocsDecoratorTypes');

var _DocsDecoratorTypes2 = _interopRequireDefault(_DocsDecoratorTypes);

var _convertFromHTML = require('./convertFromHTML');

var _convertFromHTML2 = _interopRequireDefault(_convertFromHTML);

var _convertFromRaw = require('./convertFromRaw');

var _convertFromRaw2 = _interopRequireDefault(_convertFromRaw);

var _convertToRaw = require('./convertToRaw');

var _convertToRaw2 = _interopRequireDefault(_convertToRaw);

var _getCurrentSelectionEntity = require('./getCurrentSelectionEntity');

var _getCurrentSelectionEntity2 = _interopRequireDefault(_getCurrentSelectionEntity);

var _isContentBlockEmpty = require('./isContentBlockEmpty');

var _isContentBlockEmpty2 = _interopRequireDefault(_isContentBlockEmpty);

var _tryInsertAtomicBlock = require('./tryInsertAtomicBlock');

var _tryInsertAtomicBlock2 = _interopRequireDefault(_tryInsertAtomicBlock);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _updateEntityData = require('./updateEntityData');

var _updateEntityData2 = _interopRequireDefault(_updateEntityData);

var _DocsEditorChangeType = require('./DocsEditorChangeType');

var _immutable = require('immutable');

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHAR_ZERO_WIDTH = '\u200B';

// All the modifiers in this file muss have the same interface like this:
//   `function modifyXY(editorState: EditorState, ...rest): EditorState {}``

function insertTable(editorState) {
  return insertCustomBlock(editorState, _DocsBlockTypes2.default.DOCS_TABLE, { rowsCount: 2, colsCount: 2, topRowBgStyle: 'dark' });
}

function insertExpandable(editorState) {
  return insertCustomBlock(editorState, _DocsBlockTypes2.default.DOCS_EXPANDABLE, {
    show: true,
    showLabel: '',
    hideLabel: '',
    body: ''
  });
}

function insertMath(editorState) {
  // See https://github.com/FB-PLP/react-math-input-app
  var entityData = {};
  return insertDecorator(editorState, _DocsDecoratorTypes2.default.DOCS_MATH, true, entityData, true);
}

function insertImage(editorState) {
  return insertDecorator(editorState, _DocsDecoratorTypes2.default.DOCS_IMAGE, true, {
    url: null
  }, true);
}

function insertDecorator(editorState, decoratorType, immutable, rawEntityData, addExtraSpace) {
  // See https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/modifiers/addEmoji.js
  var currentSelectionState = editorState.getSelection();
  if (!currentSelectionState.isCollapsed()) {
    return editorState;
  }
  var contentState = editorState.getCurrentContent();
  var contentStateWithEntity = contentState.createEntity(decoratorType, immutable ? 'IMMUTABLE' : 'MUTABLE', rawEntityData);
  var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  var afterRemovalContentState = _draftJs.Modifier.removeRange(contentState, currentSelectionState, 'backward');
  // deciding on the position to insert.
  var targetSelection = afterRemovalContentState.getSelectionAfter();

  // Add an invisible space before the component so that it can be selectable.
  var newContentState = _draftJs.Modifier.insertText(afterRemovalContentState, targetSelection, ' ', null, null);

  newContentState = _draftJs.Modifier.insertText(newContentState, newContentState.getSelectionAfter(), CHAR_ZERO_WIDTH, null, entityKey);
  var targetSelectionEnd = targetSelection.getAnchorOffset();
  var blockKey = targetSelection.getAnchorKey();
  var blockSize = contentState.getBlockForKey(blockKey).getLength();
  if (targetSelectionEnd === blockSize) {
    // If it is inserted at the end, a space is appended right after for
    // a smooth writing experience.
    newContentState = _draftJs.Modifier.insertText(newContentState, newContentState.getSelectionAfter(), ' ');
  }
  var newEditorState = _draftJs.EditorState.push(editorState, newContentState, 'insert-' + decoratorType);
  return _draftJs.EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
}

function moveSelectionToEnd(editorState) {
  var content = editorState.getCurrentContent();
  var blockMap = content.getBlockMap();

  var key = blockMap.last().getKey();
  var length = blockMap.last().getLength();

  var selection = new _draftJs.SelectionState({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length
  });

  return _draftJs.EditorState.forceSelection(editorState, selection);
}

function insertCustomBlock(editorState, blockType, entityData) {
  var Component = _DocsBlockTypeToComponent2.default.getComponent(blockType);

  if (!Component) {
    console.warn('No Component registered for custom block $s', blockType);
    return editorState;
  }

  var contentState = editorState.getCurrentContent();
  var contentStateWithEntity = contentState.createEntity(blockType, 'IMMUTABLE', entityData);

  var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  var newEditorState = _draftJs.EditorState.set(editorState, { currentContent: contentStateWithEntity, decorator: _DocsDecorator2.default.get() });
  return (0, _tryInsertAtomicBlock2.default)(newEditorState, entityKey, ' ') || editorState;
}

function updateLink(editorState, url) {
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var contentStateWithEntity = contentState.createEntity(_DocsDecoratorTypes2.default.LINK, 'MUTABLE', { url: url });
  var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return _draftJs.RichUtils.toggleLink(editorState, selection, url ? entityKey : null);
}

function toggleAnnotation(editorState) {
  var selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    return editorState;
  }
  var currentEntity = (0, _getCurrentSelectionEntity2.default)(editorState);
  if (currentEntity) {
    // TODO: It should not clear the whole entity, but only the selection
    // part.
    var contentState = editorState.getCurrentContent();
    var entityKey = null;
    var newContentState = _draftJs.Modifier.applyEntity(contentState, selection, entityKey);
    return _draftJs.EditorState.push(editorState, newContentState, _DocsEditorChangeType.APPLY_ENTITY);
  } else {
    var _contentState = editorState.getCurrentContent();
    var contentStateWithEntity = _contentState.createEntity(_DocsDecoratorTypes2.default.DOCS_ANNOTATION, 'MUTABLE', {
      color: 'yellow',
      token: (0, _uniqueID2.default)()
    });
    var _entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    var _newContentState = _draftJs.Modifier.applyEntity(contentStateWithEntity, selection, _entityKey);
    return _draftJs.EditorState.push(editorState, _newContentState, _DocsEditorChangeType.APPLY_ENTITY);
  }
}

// Copied from https://stackoverflow.com/questions/41193914
function insertBlock(editorState, contentBlock, direction) {
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var currentBlock = contentBlock ? contentBlock : contentState.getBlockForKey(selection.getEndKey());

  var blockMap = contentState.getBlockMap();

  // Split the blocks.
  var currentBlockKey = currentBlock.getKey();
  var finder = function finder(v) {
    return v === currentBlock;
  };
  var blocksBefore = blockMap.toSeq().takeUntil(finder);
  var blocksAfter = blockMap.toSeq().skipUntil(finder).rest();
  var newBlock = createContentBlock('');
  var newBlockKey = (0, _draftJs.genKey)();
  var newBlocks = void 0;
  if (direction === 'before') {
    newBlocks = [[newBlockKey, newBlock], [currentBlockKey, currentBlock]];
  } else {
    newBlocks = [[currentBlockKey, currentBlock], [newBlockKey, newBlock]];
  }
  var newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap();
  var newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection
  });
  return _draftJs.EditorState.push(editorState, newContentState, _DocsEditorChangeType.CHANGE_BLOCK_DATA);
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

function updateBlockStyle(editorState, contentBlock, className) {
  var contentState = editorState.getCurrentContent();
  var key = contentBlock.getKey();
  var newSelection = _draftJs.SelectionState.createEmpty(key).merge({
    focusOffset: contentBlock.getText().length
  });
  var newBlockData = contentBlock.getData().merge({
    className: className
  });
  var newContentState = _draftJs.Modifier.mergeBlockData(contentState, newSelection, newBlockData);
  return _draftJs.EditorState.push(editorState, newContentState, _DocsEditorChangeType.APPLY_ENTITY);
}

function ensureAtomicBlocksAreSelectable(editorState) {
  // If editor start with atomic block, user won't be able to select
  // and delete that atomic block. The workaround is to surround it with blank
  // blocks. See https://github.com/facebook/draft-js/issues/327
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap();
  var newBlockMap = new _immutable.OrderedMap().withMutations(function (mutableBlock) {
    var blocks = blockMap.toArray();
    blocks.forEach(function (block, ii) {
      if (block.getType() !== 'atomic') {
        mutableBlock.set(block.getKey(), block);
        return;
      }
      maybeInsertSiblingBlock(blocks[ii - 1], block, true, mutableBlock);
      maybeInsertSiblingBlock(blocks[ii + 1], block, false, mutableBlock);
    });
  });

  if (newBlockMap.size === blockMap.size && newBlockMap.first() === blockMap.first() && newBlockMap.last() === blockMap.last()) {
    // Nothing was added.
    return editorState;
  }

  // Strip the leading and tailing empty blocks.
  var shouldStripEndingEmptyBLocks = false;
  if (shouldStripEndingEmptyBLocks) {
    newBlockMap = newBlockMap.withMutations(function (mutableBlock) {
      maybeStripBlock(mutableBlock.first(), mutableBlock);
      maybeStripBlock(mutableBlock.last(), mutableBlock);
    });
  }

  var selection = editorState.getSelection();
  var newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection
  });
  return _draftJs.EditorState.push(editorState, newContentState, _DocsEditorChangeType.CHANGE_BLOCK_DATA);
}

function pasteHTML(editorState, html) {
  return (0, _convertFromHTML2.default)(html, editorState, null, null, true);
}

// Helper function for `ensureAtomicBlocksAreSelectable()`.
function maybeStripBlock(block, blockMap) {
  if (!block || block.getType() !== 'unstyled' || block.getText() || block.getData().get('className')) {
    return;
  }
  blockMap.delete(block.getKey());
}

// Helper function for `ensureAtomicBlocksAreSelectable()`.
function maybeInsertSiblingBlock(siblingBlock, currentBlock, before, blockMap) {

  if (siblingBlock && (0, _isContentBlockEmpty2.default)(siblingBlock)) {
    // No need to inject extra blank line since siblingBlock is already empty.
    // blockMap.set(currentBlock.getKey(), currentBlock);
    // return;
  }

  var className = before ? 'docs-before-atomic-block' : 'docs-after-atomic-block';

  if (0
  // !siblingBlock ||
  // siblingBlock.getData().get('className') !== className
  ) {
      var newBlock = createContentBlock('', className);
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
function createContentBlock(text, className) {
  var characterList = (0, _immutable.List)((0, _immutable.Repeat)(_draftJs.CharacterMetadata.EMPTY, text.length));
  return new _draftJs.ContentBlock({
    key: (0, _draftJs.genKey)(),
    type: 'unstyled',
    text: text,
    characterList: characterList,
    data: className ? (0, _immutable.Map)({ className: className }) : undefined
  });
}

module.exports = {
  ensureAtomicBlocksAreSelectable: ensureAtomicBlocksAreSelectable,
  insertBlock: insertBlock,
  insertCustomBlock: insertCustomBlock,
  insertExpandable: insertExpandable,
  insertImage: insertImage,
  insertMath: insertMath,
  insertTable: insertTable,
  moveSelectionToEnd: moveSelectionToEnd,
  pasteHTML: pasteHTML,
  toggleAnnotation: toggleAnnotation,
  updateBlockStyle: updateBlockStyle,
  updateEntityData: _updateEntityData2.default,
  updateLink: updateLink
};