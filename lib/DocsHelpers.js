'use strict';

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _katex = require('katex');

var _katex2 = _interopRequireDefault(_katex);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DOMElement = require('./Types').babelPluginFlowReactPropTypes_proptype_DOMElement || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DOMRect = require('./Types').babelPluginFlowReactPropTypes_proptype_DOMRect || require('prop-types').any;

var DEV_MODE = /http:\/\/localhost/.test(window.location.href);
var INVISIBLE_PREFIX = '\u200B\u2063\uFEFF\u200C';
var INVISIBLE_SUFFIX = INVISIBLE_PREFIX.split('').reverse().join('');

// Random core atomic helpers are placed at this file.
// Do not require any Component  or Modifier in this file to avoid circular
// dependiencies.

function warn(ex) {
  if (DEV_MODE) {
    console.warn(ex);
  }
}

function tryFindDOMNode(component) {
  try {
    return _reactDom2.default.findDOMNode(component);
  } catch (ex) {
    warn(ex);
    return null;
  }
}

function tryInsertAtomicBlock(editorState, entityKey, text) {
  try {
    return _draftJs.AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, text);
  } catch (ex) {
    warn(ex);
    return null;
  }
}

function tryGetEntityAtContentState(contentState, entityKey) {
  try {
    return contentState.getEntity(entityKey);
  } catch (ex) {
    // entity was removed, we should clean up `contentState` later.
    warn(ex);
    return null;
  }
}

function tryFocus(obj, resumeSelection) {
  if (obj) {
    try {
      obj.focus(resumeSelection);
    } catch (ex) {
      warn(ex);
    }
  }
}

function tryBlur(obj) {
  if (obj) {
    try {
      obj.blur();
    } catch (ex) {
      warn(ex);
    }
  }
}

function createDOMCustomEvent(type, bubbles, cancelable, detail) {
  if (detail === undefined) {
    detail = null;
  }
  return new CustomEvent(type, { bubbles: bubbles, cancelable: cancelable, detail: detail });
}

function getComponentByElement(components, element) {
  var elementToComponent = new _map2.default();
  components.forEach(function (component) {
    var node = _reactDom2.default.findDOMNode(component);
    if (node) {
      elementToComponent.set(node, component);
    }
  });

  while (element && element.nodeType === 1) {
    if (elementToComponent.has(element)) {
      return elementToComponent.get(element);
    }
    element = element.parentNode;
  }
  return null;
}

function getDOMSelectionRect() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  var range = selection.getRangeAt(0);
  var rect = range ? range.getBoundingClientRect() : null;
  if (rect && rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0 && range && range.commonAncestorContainer) {
    // If the selection is collapsed, the rect will be empty.
    // use the element's rect where the cursor is at instead.
    rect = range.commonAncestorContainer.getBoundingClientRect();
  }
  return rect;
}

function getDOMSelectionNode() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  var range = selection.getRangeAt(0);
  var node = range.commonAncestorContainer;
  if (node && node.nodeType === 3) {
    // TEXT_NODE
    node = node.parentNode;
  }
  return node || null;
}

function getDOMSelectionRange() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount !== 1) {
    return null;
  }
  return selection.getRangeAt(0);
}

function restoreDOMSelectionRange(range) {
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function getCurrentSelectionEntity(editorState) {
  var selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return null;
  }
  var contentState = editorState.getCurrentContent();
  var startKey = editorState.getSelection().getStartKey();
  var startOffset = editorState.getSelection().getStartOffset();
  var blockWithEntityAtBeginning = contentState.getBlockForKey(startKey);
  if (!blockWithEntityAtBeginning) {
    return null;
  }
  var entityKey = blockWithEntityAtBeginning.getEntityAt(startOffset);
  if (!entityKey) {
    return null;
  }
  return tryGetEntityAtContentState(contentState, entityKey);
}

function findEntitiesForType(entityType, contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    if (entityKey === null || entityKey === undefined) {
      return false;
    }
    var entity = contentState.getEntity(entityKey);
    if (!entity) {
      return false;
    }
    return entity.getType() === entityType;
  }, callback);
}

function lookupElementByAttribute(element, attr, value) {
  var node = element;
  while (node) {
    if (node && node.nodeType === 1) {
      if (value === undefined && node.hasAttribute(attr)) {
        return node;
      } else if (node.getAttribute(attr) === value) {
        return node;
      }
    }
    node = node.parentNode;
  }
  return null;
}

var latexEl = document.createElement('div');
function renderLatexAsHTML(latex) {
  if (!latex) {
    return '';
  }
  latexEl.innerHTML = '';
  try {
    _katex2.default.render(latex, latexEl);
  } catch (ex) {
    latexEl.innerHTML = '';
    latexEl.appendChild(document.createTextNode(latex));
  }
  var html = latexEl.innerHTML;
  latexEl.innerHTML = '';
  return html;
}

// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
function getSafeBodyFromHTML(html) {
  var doc = void 0;
  var root = null;
  // Provides a safe context
  if (document.implementation && document.implementation.createHTMLDocument) {
    doc = document.implementation.createHTMLDocument('');
    (0, _invariant2.default)(doc.documentElement, 'Missing doc.documentElement');
    doc.documentElement.innerHTML = html;
    root = doc.getElementsByTagName('body')[0];
  }
  return root;
}

function asElement(node) {
  (0, _invariant2.default)(node && node.nodeType === 1, 'invalid element');
  var el = node;
  return el;
}

// This is copied from
// draft-js/src/component/utils/splitTextIntoTextBlocks.js
var NEWLINE_REGEX = /\r\n?|\n/g;
function splitTextIntoTextBlocks(text) {
  return text.split(NEWLINE_REGEX);
}

function isEditorStateEmpty(editorState) {
  return !editorState.getCurrentContent().hasText();
}

module.exports = {
  INVISIBLE_PREFIX: INVISIBLE_PREFIX,
  INVISIBLE_SUFFIX: INVISIBLE_SUFFIX,
  asElement: asElement,
  createDOMCustomEvent: createDOMCustomEvent,
  findEntitiesForType: findEntitiesForType,
  getComponentByElement: getComponentByElement,
  getCurrentSelectionEntity: getCurrentSelectionEntity,
  getDOMSelectionNode: getDOMSelectionNode,
  getDOMSelectionRange: getDOMSelectionRange,
  getDOMSelectionRect: getDOMSelectionRect,
  getSafeBodyFromHTML: getSafeBodyFromHTML,
  isEditorStateEmpty: isEditorStateEmpty,
  lookupElementByAttribute: lookupElementByAttribute,
  renderLatexAsHTML: renderLatexAsHTML,
  restoreDOMSelectionRange: restoreDOMSelectionRange,
  splitTextIntoTextBlocks: splitTextIntoTextBlocks,
  tryBlur: tryBlur,
  tryFindDOMNode: tryFindDOMNode,
  tryFocus: tryFocus,
  tryGetEntityAtContentState: tryGetEntityAtContentState,
  tryInsertAtomicBlock: tryInsertAtomicBlock,
  tryWarn: warn,
  uniqueID: _uniqueID2.default
};