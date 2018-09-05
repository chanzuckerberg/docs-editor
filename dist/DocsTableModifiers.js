'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsTableEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsTableEntityData || require('prop-types').any;

var DocsTableEntityDataKeys = {
  LEFT_COL_BG_STYLE: 'leftColBgStyle',
  NO_BORDERS: 'noBorders',
  PADDING_SIZE: 'paddingSize',
  TOP_ROW_BG_STYLE: 'topRowBgStyle'
};

var LOCAL_CHANGE_ID = '_docs_table_cell_local_change';

function getEntityDataID(rowIndex, cellIndex) {
  return 'cell_' + rowIndex + '_' + cellIndex;
}

function shiftCell(entityData, fromID, toID) {
  var cellBgStyles = entityData.cellBgStyles,
      cellColSpans = entityData.cellColSpans,
      cellRowSpans = entityData.cellRowSpans;

  entityData[toID] = entityData[fromID];
  delete entityData[fromID];

  if (cellBgStyles) {
    cellBgStyles[toID] = cellBgStyles[fromID];
    delete cellBgStyles[fromID];
  }
  if (cellColSpans) {
    cellColSpans[toID] = cellColSpans[fromID];
    delete cellColSpans[fromID];
  }
  if (cellRowSpans) {
    cellRowSpans[toID] = cellRowSpans[fromID];
    delete cellRowSpans[fromID];
  }
  return entityData;
}

// These are the very naive implementation of functions that update rows.
// Need a better way of doing this.
function insertRow(entityData, rowIndex, colIndex, before) {

  var newEntityData = (0, _extends5.default)({}, entityData, {
    rowsCount: entityData.rowsCount + 1
  });

  var _newEntityData = newEntityData,
      colsCount = _newEntityData.colsCount,
      rowsCount = _newEntityData.rowsCount,
      rowHeights = _newEntityData.rowHeights;


  var start = before ? rowIndex : rowIndex + 1;
  var end = rowsCount;
  var rr = end;
  while (rr > start) {
    var cc = 0;
    while (cc < colsCount) {
      var fromID = getEntityDataID(rr - 1, cc);
      var toID = getEntityDataID(rr, cc);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc++;
    }
    if (rowHeights) {
      var prevHeight = rowHeights[rr - 1];
      if (prevHeight) {
        rowHeights[rr] = prevHeight;
        delete rowHeights[rr - 1];
      }
    }
    rr--;
  }
  return newEntityData;
}

function insertRowAfter(entityData, rowIndex, colIndex) {
  return insertRow(entityData, rowIndex, colIndex, false);
}

function insertRowBefore(entityData, rowIndex, colIndex) {
  return insertRow(entityData, rowIndex, colIndex, true);
}

function deleteRow(entityData, rowIndex, colIndex, before) {
  if (entityData.rowsCount <= 1) {
    return entityData;
  }

  var newEntityData = (0, _extends5.default)({}, entityData, {
    rowsCount: entityData.rowsCount - 1
  });
  var _newEntityData2 = newEntityData,
      colsCount = _newEntityData2.colsCount,
      rowsCount = _newEntityData2.rowsCount,
      rowHeights = _newEntityData2.rowHeights;

  var rr = rowIndex;
  while (rr < rowsCount) {
    var cc = 0;
    while (cc < colsCount) {
      var fromID = getEntityDataID(rr + 1, cc);
      var toID = getEntityDataID(rr, cc);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc++;
    }
    if (rowHeights) {
      var nextHeight = rowHeights[rr + 1];
      if (nextHeight) {
        rowHeights[rr] = nextHeight;
        delete rowHeights[rr + 1];
      }
    }
    rr++;
  }
  return newEntityData;
}

function deleteColumn(entityData, rowIndex, colIndex) {
  var newEntityData = (0, _extends5.default)({}, entityData, {
    colsCount: entityData.colsCount - 1
  });
  var _newEntityData3 = newEntityData,
      rowsCount = _newEntityData3.rowsCount,
      colsCount = _newEntityData3.colsCount,
      colWidths = _newEntityData3.colWidths;

  var start = colIndex;
  var end = colsCount;
  var rr = 0;
  while (rr < rowsCount) {
    var cc = start;
    while (cc < end) {
      var fromID = getEntityDataID(rr, cc);
      var toID = getEntityDataID(rr, cc - 1);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc++;
    }
    rr++;
  }

  // Re-allocate width to sibling column.
  if (Array.isArray(colWidths) && colWidths.length === colsCount - 1) {
    var newWidth = colWidths[colIndex] / 2;
    var newColWidths = colWidths.slice(0);
    newColWidths[colIndex] = newWidth;
    newColWidths.splice(colIndex, 0, newWidth);
    newEntityData.colWidths = newColWidths;
  } else {
    delete newEntityData.colWidths;
  }

  // Allocate width to sibling column.
  if (Array.isArray(colWidths) && colWidths.length === colsCount) {
    var deletedWidth = colWidths[colIndex];
    var _newColWidths = colWidths.slice(0);
    _newColWidths.splice(colIndex, 1);
    if (_newColWidths[colIndex - 1]) {
      _newColWidths[colIndex - 1] += deletedWidth;
    } else if (_newColWidths[colIndex - 1]) {
      _newColWidths[colIndex + 1] += deletedWidth;
    } else {
      _newColWidths = undefined;
    }
    newEntityData.colWidths = _newColWidths;
  } else {
    delete newEntityData.colWidths;
  }
  return newEntityData;
}

function insertColumn(entityData, rowIndex, colIndex, before) {
  var newEntityData = (0, _extends5.default)({}, entityData, {
    colsCount: entityData.colsCount + 1
  });
  var _newEntityData4 = newEntityData,
      rowsCount = _newEntityData4.rowsCount,
      colsCount = _newEntityData4.colsCount,
      colWidths = _newEntityData4.colWidths;

  var start = before ? colIndex : colIndex + 1;
  var end = colsCount;
  var rr = 0;
  while (rr < rowsCount) {
    var cc = end;
    while (cc > start) {
      var fromID = getEntityDataID(rr, cc - 1);
      var toID = getEntityDataID(rr, cc);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc--;
    }
    rr++;
  }

  // Re-allocate width to sibling column.
  if (Array.isArray(colWidths) && colWidths.length === colsCount - 1) {
    var newWidth = colWidths[colIndex] / 2;
    var newColWidths = colWidths.slice(0);
    newColWidths[colIndex] = newWidth;
    newColWidths.splice(colIndex, 0, newWidth);
    newEntityData.colWidths = newColWidths;
  } else {
    delete newEntityData.colWidths;
  }

  return newEntityData;
}

function insertColumnAfter(entityData, rowIndex, colIndex) {
  return insertColumn(entityData, rowIndex, colIndex, false);
}

function insertColumnBefore(entityData, rowIndex, colIndex) {
  return insertColumn(entityData, rowIndex, colIndex, true);
}

function toggleIndexColumnBackground(entityData) {
  var key = DocsTableEntityDataKeys.LEFT_COL_BG_STYLE;
  var value = !entityData[key];
  return (0, _extends5.default)({}, entityData, {
    leftColBgStyle: value ? 'dark' : undefined
  });
}

function toggleHeaderBackground(entityData, forceEnabled) {
  var key = DocsTableEntityDataKeys.TOP_ROW_BG_STYLE;
  var value = forceEnabled || !entityData[key];
  var bgStyle = value ? 'dark' : undefined;
  if (entityData[key] === bgStyle) {
    return entityData;
  }
  return (0, _extends5.default)({}, entityData, (0, _defineProperty3.default)({}, key, bgStyle));
}

function toggleBorders(entityData) {
  var key = DocsTableEntityDataKeys.NO_BORDERS;
  var value = !entityData[key];
  var v = (0, _extends5.default)({}, entityData, (0, _defineProperty3.default)({}, key, value ? true : undefined));
  return v;
}

function togglePaddings(entityData) {
  var key = DocsTableEntityDataKeys.PADDING_SIZE;
  var value = !entityData[key];
  return (0, _extends5.default)({}, entityData, {
    paddingSize: value ? 'large' : undefined
  });
}

module.exports = {
  LOCAL_CHANGE_ID: LOCAL_CHANGE_ID,
  DocsTableEntityDataKeys: DocsTableEntityDataKeys,
  deleteColumn: deleteColumn,
  deleteRow: deleteRow,
  getEntityDataID: getEntityDataID,
  insertColumnAfter: insertColumnAfter,
  insertColumnBefore: insertColumnBefore,
  insertRowAfter: insertRowAfter,
  insertRowBefore: insertRowBefore,
  toggleBorders: toggleBorders,
  toggleHeaderBackground: toggleHeaderBackground,
  toggleIndexColumnBackground: toggleIndexColumnBackground,
  togglePaddings: togglePaddings
};