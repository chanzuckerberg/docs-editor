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

var babelPluginFlowReactPropTypes_proptype_HTMLCollectionLike = require('./Types').babelPluginFlowReactPropTypes_proptype_HTMLCollectionLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocumentLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocumentLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsTableEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsTableEntityData || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_SafeHTML = require('./getSafeHTML').babelPluginFlowReactPropTypes_proptype_SafeHTML || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_CSSRules = require('./getCSSRules').babelPluginFlowReactPropTypes_proptype_CSSRules || require('prop-types').any;

function setDocsTableEntityDataFromCell(safeHTML, row, cell, convertFromHTML, entityData) {
  var newEntityData = entityData;
  var colsCount = entityData.colsCount,
      rowsCount = entityData.rowsCount;

  var rowIndex = (0, _asNumber2.default)(row.rowIndex);
  var cellIndex = (0, _asNumber2.default)(cell.cellIndex);
  var classList = cell.classList,
      nodeName = cell.nodeName,
      innerHTML = cell.innerHTML,
      colSpan = cell.colSpan,
      rowSpan = cell.rowSpan;

  if (rowIndex === 0 && nodeName === 'TH') {
    newEntityData = (0, _DocsTableModifiers.toggleHeaderBackground)(newEntityData, true);
  }
  var cellEditorState = convertFromHTML(innerHTML, null, // TODO: Find a way to get the editor state.
  row.ownerDocument, safeHTML.cssRules);

  var id = (0, _DocsTableModifiers.getEntityDataID)(rowIndex, cellIndex);
  newEntityData[id] = (0, _convertToRaw2.default)(cellEditorState);

  if (colSpan && colSpan > 1) {
    var cellColSpans = newEntityData.cellColSpans || {};
    cellColSpans[id] = Math.min(colSpan, colsCount - cellIndex);
    newEntityData.cellColSpans = cellColSpans;
  }

  if (rowSpan && rowSpan > 1) {
    var cellRowSpans = newEntityData.cellRowSpans || {};
    cellRowSpans[id] = Math.min(rowSpan, rowsCount - rowIndex);
    newEntityData.cellRowSpans = cellRowSpans;
  }

  if (!classList || !classList.length) {
    return newEntityData;
  }

  // The table-cell might have a className that can be mapped to the custom
  // style. Find out what that className is.
  classList.forEach(function (cellClassName) {
    var selector = '.' + cellClassName;
    var styleMap = safeHTML.cssRules.get(selector);
    if (styleMap) {
      var borderColor = undefined;
      styleMap.forEach(function (styleValue, styleName) {
        if (styleName === 'background-color') {
          var customClassName = _DocsCustomStyleMap2.default.forBackgroundColor(styleValue);
          if (customClassName) {
            var cellBgStyles = newEntityData.cellBgStyles || {};
            cellBgStyles[id] = customClassName;
            newEntityData.cellBgStyles = cellBgStyles;
          }
        } else if (styleName === 'width' && rowIndex === 0) {
          var colWidths = newEntityData.colWidths || [];
          var width = styleValue;
          colWidths[cellIndex] = width;
          newEntityData.colWidths = colWidths;
        } else if (styleName === 'border-left-color' || styleName === 'border-top-color' || styleName === 'border-right-color' || styleName === 'border-bottom-color') {
          if (borderColor === undefined) {
            borderColor = styleValue;
          } else if (borderColor !== styleValue) {
            borderColor = null;
          }
        }
      });

      // If all cells have the same white border, hides the border.
      if (newEntityData.noBorders !== false && borderColor && (0, _color2.default)(borderColor).hex() === '#FFFFFF') {
        newEntityData.noBorders = true;
      } else {
        newEntityData.noBorders = false;
      }
    }
  });

  return newEntityData;
}

function setDocsTableEntityDataFromRow(safeHTML, row, convertFromHTML, entityData) {
  var cells = row.cells,
      classList = row.classList,
      rowIndex = row.rowIndex;

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

  if (!classList || !classList.length) {
    return newEntityData;
  }

  // The table-cell might have a className that can be mapped to the custom
  // style. Find out what that className is.
  classList.forEach(function (cellClassName) {
    var selector = '.' + cellClassName;
    var styleMaps = safeHTML.cssRules.get(selector);
    if (styleMaps) {
      styleMaps.forEach(function (styleValue, styleName) {
        if (styleName === 'height') {
          var height = 0;
          if (styleValue.indexOf('pt') > 0) {
            height = parseInt(styleValue, 10);
          } else if (styleValue.indexOf('px') > 0) {
            height = parseInt(styleValue, 10);
          }

          if (height) {
            var rowHeights = newEntityData.rowHeights || {};
            rowHeights[(0, _asNumber2.default)(row.rowIndex)] = (0, _asNumber2.default)(height);
            newEntityData.rowHeights = rowHeights;
          }
        }
      });
    }
  });

  return newEntityData;
}

function getRowsCount(rows) {
  return rows && rows.length || 0;
}

function getColsCount(rows) {
  var firstRow = rows ? rows[0] : null;
  if (!firstRow) {
    return 0;
  }
  var cells = firstRow.cells;

  if (!cells || !cells.length) {
    return 0;
  }
  return (0, _from2.default)(cells).reduce(function (sum, cell) {
    sum++;
    if (cell && cell.colSpan && cell.colSpan > 1) {
      sum += cell.colSpan - 1;
    }
    return sum >= 0 ? sum : 0;
  }, 0);
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


  var rowsCount = getRowsCount(rows);
  var colsCount = getColsCount(rows);
  if (rowsCount === 0 || colsCount === 0) {
    return entityData;
  }

  entityData.rowsCount = rowsCount;
  entityData.colsCount = colsCount;
  var rr = 0;
  var useHeader = false;
  if (rows) {
    while (rr < rowsCount) {
      var row = rows[rr];
      if (row) {
        entityData = setDocsTableEntityDataFromRow(safeHTML, row, convertFromHTML, entityData);
      }
      rr++;
    }
  }
  entityData.colWidths = convertColumnWidthToPercentageNumbers(entityData);
  return entityData;
}

function convertColumnWidthToPercentageNumbers(entityData) {
  var colWidths = entityData.colWidths,
      colsCount = entityData.colsCount;

  if (!Array.isArray(colWidths) || colWidths.length === 0 || colWidths.length !== colsCount) {
    return null;
  }
  var unitValuePattern = /[\.\d]/g;
  var firstWidth = String(colWidths[0]);
  var totalWidth = colWidths.reduce(function (sum, width, ii) {
    var currentWidth = String(width);
    var currentUnit = currentWidth.replace(unitValuePattern, '');
    if (ii > 1) {
      var prevWidth = String(colWidths[ii - 1]);
      var prevUnit = prevWidth.replace(unitValuePattern, '');
      if (!prevUnit || prevUnit !== currentUnit) {
        // It expects that all columns use the same CSS unit.
        return -1;
      }
    }
    sum += parseFloat(currentWidth);
    return sum;
  }, 0);

  if (totalWidth <= 0) {
    return null;
  }

  return colWidths.map(function (w) {
    var decimal = parseFloat(w) / totalWidth;
    return Math.round(decimal * 1000) / 1000;
  });
}

exports.default = createDocsTableEntityDataFromElement;