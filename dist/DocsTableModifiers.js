'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

// These are the very naive implementation of functions that update rows.
// Need a better way of doing this.
function insertRow(entityData, rowIndex, before) {
  var _entityData = entityData,
      rowsCount = _entityData.rowsCount,
      colsCount = _entityData.colsCount;

  var newEntityData = (0, _extends5.default)({}, entityData, {
    rowsCount: rowsCount + 1,
    colsCount: colsCount
  });
  var rr = 0;
  entityData = JSON.parse((0, _stringify2.default)(entityData));
  var jj = before ? rowIndex : rowIndex + 1;
  var kk = newEntityData.rowsCount;
  while (rr < kk) {
    var cc = 0;
    while (cc < colsCount) {
      var id = getEntityDataID(rr, cc);
      var data = entityData[id] || {};
      delete data[LOCAL_CHANGE_ID];
      if (rr < jj) {
        newEntityData[id] = data;
      } else {
        var newID = getEntityDataID(rr + 1, cc);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }
  return newEntityData;
}

function insertRowAfter(entityData, rowIndex, colIndex) {
  return insertRow(entityData, rowIndex, false);
}

function insertRowBefore(entityData, rowIndex, colIndex) {
  return insertRow(entityData, rowIndex, true);
}

function deleteRow(entityData, rowIndex, colIndex) {
  var rowsCount = entityData.rowsCount,
      colsCount = entityData.colsCount;

  if (rowsCount <= 1) {
    return entityData;
  }
  var newEntityData = {
    rowsCount: rowsCount - 1,
    colsCount: colsCount
  };
  var rr = 0;
  var kk = newEntityData.rowsCount;
  while (rr < kk) {
    var cc = 0;
    while (cc < colsCount) {
      var id = getEntityDataID(rr, cc);
      var data = (0, _extends5.default)({}, entityData[id]);
      if (rr < rowIndex) {
        newEntityData[id] = data;
      } else if (rr > rowIndex) {
        var newID = getEntityDataID(rr - 1, cc);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }
  return newEntityData;
}

function deleteColumn(entityData, rowIndex, colIndex) {
  var _entityData2 = entityData,
      rowsCount = _entityData2.rowsCount,
      colsCount = _entityData2.colsCount;

  if (colsCount <= 1) {
    return entityData;
  }
  entityData = JSON.parse((0, _stringify2.default)(entityData));
  var newEntityData = (0, _extends5.default)({}, entityData, {
    rowsCount: rowsCount,
    colsCount: colsCount - 1,
    colWidths: null
  });
  var kk = newEntityData.colsCount;
  var rr = 0;
  while (rr < rowsCount) {
    var cc = 0;
    while (cc < kk) {
      var id = getEntityDataID(rr, cc);
      var data = entityData[id];
      if (cc < colIndex) {
        newEntityData[id] = data;
      } else if (cc > colIndex) {
        var newID = getEntityDataID(rr, cc - 1);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }

  // Allocate width to sibling column.
  var _entityData3 = entityData,
      colWidths = _entityData3.colWidths;

  var newColWidths = void 0;
  if (Array.isArray(colWidths) && colWidths.length === colsCount) {
    var deletedWidth = colWidths[colIndex];
    newColWidths = colWidths.slice(0);
    newColWidths.splice(colIndex, 1);
    if (newColWidths[colIndex - 1]) {
      newColWidths[colIndex - 1] += deletedWidth;
    } else if (newColWidths[colIndex - 1]) {
      newColWidths[colIndex + 1] += deletedWidth;
    } else {
      newColWidths = undefined;
    }
  }
  newEntityData.colWidths = newColWidths;
  return newEntityData;
}

function insertColumn(entityData, colIndex, before) {
  var _entityData4 = entityData,
      rowsCount = _entityData4.rowsCount,
      colsCount = _entityData4.colsCount;

  var newEntityData = (0, _extends5.default)({}, entityData, {
    colWidths: null,
    colsCount: colsCount + 1,
    rowsCount: rowsCount
  });
  var rr = 0;
  // This is just the naive way to deeply clone the object.
  entityData = JSON.parse((0, _stringify2.default)(entityData));

  var kk = newEntityData.colsCount;
  while (rr < rowsCount) {
    var cc = 0;
    while (cc < kk) {
      var jj = before ? colIndex : colIndex + 1;
      var id = getEntityDataID(rr, cc);
      var data = entityData[id] || {};
      delete data[LOCAL_CHANGE_ID];
      if (cc < jj) {
        newEntityData[id] = data;
      } else {
        var newID = getEntityDataID(rr, cc + 1);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }

  // Allocate width to sibling column.
  var _entityData5 = entityData,
      colWidths = _entityData5.colWidths;

  var newColWidths = void 0;
  if (Array.isArray(colWidths) && colWidths.length === colsCount) {
    var newWidth = colWidths[colIndex] / 2;
    newColWidths = colWidths.slice(0);
    newColWidths[colIndex] = newWidth;
    newColWidths.splice(colIndex, 0, newWidth);
  }

  newEntityData.colWidths = newColWidths;
  return newEntityData;
}

function insertColumnAfter(entityData, rowIndex, colIndex) {
  return insertColumn(entityData, colIndex, false);
}

function insertColumnBefore(entityData, rowIndex, colIndex) {
  return insertColumn(entityData, colIndex, true);
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