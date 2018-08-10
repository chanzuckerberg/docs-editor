'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _DocsBlockTypeToComponent = require('./DocsBlockTypeToComponent');

var _DocsBlockTypeToComponent2 = _interopRequireDefault(_DocsBlockTypeToComponent);

var _tryGetEntityAtContentState = require('./tryGetEntityAtContentState');

var _tryGetEntityAtContentState2 = _interopRequireDefault(_tryGetEntityAtContentState);

var _draftJs = require('draft-js');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderBlock(contentBlock, blockProps) {
  var blockType = contentBlock.getType();
  if (blockType !== 'atomic') {
    return null;
  }
  var entityKey = contentBlock.getEntityAt(0);
  var contentState = blockProps.editorState.getCurrentContent();
  var entity = entityKey ? (0, _tryGetEntityAtContentState2.default)(contentState, entityKey) : null;
  if (!entity) {
    // This happens while pasting HTML from external sources and we failed
    // to parse its data.
    return null;
  }
  var type = entity.getType();
  var Component = _DocsBlockTypeToComponent2.default.getComponent(type);
  if (Component) {
    return {
      component: Component,
      editable: false,
      props: (0, _extends3.default)({}, blockProps, {
        entity: entity,
        entityKey: entityKey
      })
    };
  }
  return null;
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

  return classNames.length ? classNames.join(' ') : null;
}

function getBlockRenderMap() {
  return _draftJs.DefaultDraftBlockRenderMap.set('paragraph', { element: 'p' });
}

module.exports = {
  getBlockRenderMap: getBlockRenderMap,
  getStyle: getStyle,
  renderBlock: renderBlock
};