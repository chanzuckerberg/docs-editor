'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _DocsCustomStyleMap = require('./DocsCustomStyleMap');

var _DocsCustomStyleMap2 = _interopRequireDefault(_DocsCustomStyleMap);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _asNumber = require('./asNumber');

var _asNumber2 = _interopRequireDefault(_asNumber);

var _convertToRaw = require('./convertToRaw');

var _convertToRaw2 = _interopRequireDefault(_convertToRaw);

var _createEmptyEditorState = require('./createEmptyEditorState');

var _createEmptyEditorState2 = _interopRequireDefault(_createEmptyEditorState);

var _getSafeHTML = require('./getSafeHTML');

var _getSafeHTML2 = _interopRequireDefault(_getSafeHTML);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _draftJs = require('draft-js');

var _DocsTableModifiers = require('./DocsTableModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocumentLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocumentLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsTableEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsTableEntityData || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_SafeHTML = require('./getSafeHTML').babelPluginFlowReactPropTypes_proptype_SafeHTML || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_CSSRules = require('./getCSSRules').babelPluginFlowReactPropTypes_proptype_CSSRules || require('prop-types').any;

function setDocsTableEntityDataFromCell(safeHTML, row, cell, convertFromHTML, entityData) {
  var newEntityData = entityData;
  var rowIndex = (0, _asNumber2.default)(row.rowIndex);
  var cellIndex = (0, _asNumber2.default)(cell.cellIndex);
  var classList = cell.classList,
      nodeName = cell.nodeName,
      innerHTML = cell.innerHTML,
      colSpan = cell.colSpan,
      rowSpan = cell.rowSpan;

  if (rowIndex === 0 && nodeName === 'TH') {
    newEntityData.topRowBgStyle = 'dark';
    // newEntityData = toggleHeaderBackground(newEntityData, true);
  }
  var cellEditorState = convertFromHTML(innerHTML, null, // TODO: Find a way to get the editor state.
  row.ownerDocument, safeHTML.cssRules);

  var id = (0, _DocsTableModifiers.getEntityDataID)(rowIndex, cellIndex);
  newEntityData[id] = (0, _convertToRaw2.default)(cellEditorState);

  if (colSpan && colSpan > 1) {
    var cellColSpans = newEntityData.cellColSpans || {};
    cellColSpans[id] = colSpan;
    newEntityData.cellColSpans = cellColSpans;
  }

  if (rowSpan && rowSpan > 1) {
    var cellRowSpans = newEntityData.cellRowSpans || {};
    cellRowSpans[id] = rowSpan;
    newEntityData.cellRowSpans = cellRowSpans;
  }

  if (!classList || !classList.length) {
    return newEntityData;
  }

  // The table-cell might have a className that can be mapped to the custom
  // background color. Find out what that className is.
  classList.forEach(function (cellClassName) {
    var selector = '.' + cellClassName;
    var rules = safeHTML.cssRules.get(selector);
    if (rules) {
      rules.forEach(function (styleValue, styleName) {
        if (styleName === 'background-color') {
          var customClassName = _DocsCustomStyleMap2.default.forBackgroundColor(styleValue);
          if (customClassName) {
            var cellBgStyles = newEntityData.cellBgStyles || {};
            cellBgStyles[id] = customClassName;
            newEntityData.cellBgStyles = cellBgStyles;
          }
        }
      });
    }
  });

  return newEntityData;
}

function setDocsTableEntityDataFromRow(safeHTML, row, convertFromHTML, entityData) {
  var cells = row.cells;

  if (!cells || !cells.length) {
    return entityData;
  }
  var newEntityData = entityData;
  for (var ii = 0, jj = cells.length; ii < jj; ii++) {
    var cell = cells[ii];
    if (cell) {
      newEntityData = setDocsTableEntityDataFromCell(safeHTML, row, cell, convertFromHTML, entityData);
    }
  }
  return newEntityData;
}

function createDocsTableEntityDataFromElement(safeHTML, table, convertFromHTML) {
  (0, _invariant2.default)(table.nodeName === 'TABLE', 'must be a table');
  var entityData = {
    rowsCount: 0,
    colsCount: 0,
    cellColSpans: {},
    cellRowSpans: {},
    cellBgStyles: {}
  };

  // The children of `table` should have been quarantined. We need to access
  // the children from the quarantine pool.
  var el = (0, _asElement2.default)(safeHTML.unsafeNodes.get((0, _asElement2.default)(table).id));

  // TODO: What about having multiple <tbody />, <thead /> and <col />
  // colsSpan, rowsSpan...etc?
  var rows = el.rows;


  if (!rows || !rows[0] || !rows[0].cells || rows[0].cells.length === 0) {
    return entityData;
  }

  var rowsCount = rows ? rows.length : 0;
  var colsCount = (0, _from2.default)(rows).reduce(function (max, row) {
    if (row && row.cells) {
      var len = row.cells.length;
      return len > max ? len : max;
    }
    return max;
  }, 0);

  entityData.rowsCount = rowsCount;
  entityData.colsCount = colsCount;
  var rr = 0;
  var useHeader = false;
  while (rr < rowsCount) {
    var row = rows[rr];
    if (row) {
      entityData = setDocsTableEntityDataFromRow(safeHTML, row, convertFromHTML, entityData);
    }
    rr++;
  }

  return entityData;
}

exports.default = createDocsTableEntityDataFromElement;