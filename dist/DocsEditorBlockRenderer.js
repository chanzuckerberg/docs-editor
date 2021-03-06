'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _DocsBlockTypeToComponent = require('./DocsBlockTypeToComponent');

var _DocsBlockTypeToComponent2 = _interopRequireDefault(_DocsBlockTypeToComponent);

var _DocsCustomStyleMap = require('./DocsCustomStyleMap');

var _DocsCustomStyleMap2 = _interopRequireDefault(_DocsCustomStyleMap);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tryGetEntityAtContentState = require('./tryGetEntityAtContentState');

var _tryGetEntityAtContentState2 = _interopRequireDefault(_tryGetEntityAtContentState);

var _draftJs = require('draft-js');

var _DocsBlockTypes = require('./DocsBlockTypes');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copied from https://github.com/facebook/draft-js/blob/master/src/model/constants/DraftBlockType.js#L27-L28
var H1 = 'header-one';

var H2 = 'header-two';
var H3 = 'header-three';
var H4 = 'header-four';
var ORDERED_LIST_ITEM = 'ordered-list-item';
var PARAGRAPH = 'paragraph';
var UNORDERED_LIST_ITEM = 'unordered-list-item';
var UNSTYLED = 'unstyled';
var BLOCKQUOTE = 'blockquote';

function renderBlock(contentBlock, blockProps) {

  var component = void 0;
  var props = void 0;
  var editable = void 0;

  switch (contentBlock.getType()) {
    case 'atomic':
      var contentState = blockProps.editorState.getCurrentContent();
      var entityKey = contentBlock.getEntityAt(0);
      // entity could be `null`.
      // This happens while pasting HTML from external sources and we failed
      // to parse its data.
      var entity = entityKey ? (0, _tryGetEntityAtContentState2.default)(contentState, entityKey) : null;
      if (entity) {
        component = _DocsBlockTypeToComponent2.default.getComponent(entity.getType());
        editable = false;
        props = (0, _extends3.default)({}, blockProps, {
          entity: entity,
          entityKey: entityKey
        });
      }
      break;

    default:
      return null;
  }

  if (!component) {
    return null;
  }

  return {
    component: component,
    editable: editable,
    props: props
  };
}

function getStyle(contentBlock) {
  // => Map
  var classNames = [];

  var blockData = contentBlock.getData();

  // This handles in-editor changes. (e.g. Toggle alignment).
  if (blockData && blockData.has('className')) {
    classNames.push(blockData.get('className'));
  }

  // => OrderedSet
  // This handles pasted style.
  var inlineStyleSet = contentBlock.getInlineStyleAt(0);
  if (inlineStyleSet && inlineStyleSet.size > 0) {
    classNames.push.apply(classNames, inlineStyleSet.toArray());
  }

  var blockType = contentBlock.getType();
  switch (blockType) {
    case UNSTYLED:
      var className = _DocsCustomStyleMap2.default.forDepth(contentBlock.getDepth());
      className && classNames.push(className);
      break;

    case UNORDERED_LIST_ITEM:
    case ORDERED_LIST_ITEM:
    case BLOCKQUOTE:
    case H1:
    case H2:
    case H3:
    case H4:
      classNames.push(blockType);
      break;
    case UNSTYLED:
      // TODO: Should we support depth for this block?
      // const depth = contentBlock.getDepth();
      // const depthClassName = DocsCustomStyleMap.forDepth(depth);
      // depthClassName && classNames.push(depthClassName);
      break;
  }

  return classNames.length ? classNames.join(' ') : null;
}

// https://github.com/facebook/draft-js/blob/0.10-stable/src/model/immutable/DefaultDraftBlockRenderMap.js#L22
// https://github.com/facebook/draft-js/issues/1497

var BLOCK_RENDER_MAP = _draftJs.DefaultDraftBlockRenderMap.merge((0, _immutable.Map)((0, _defineProperty3.default)({}, PARAGRAPH, { element: 'p' })));

function getBlockRenderMap() {
  return BLOCK_RENDER_MAP;
}

module.exports = {
  getBlockRenderMap: getBlockRenderMap,
  getStyle: getStyle,
  renderBlock: renderBlock
};