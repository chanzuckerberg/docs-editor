// @flow

import type {TableEntityData} from './Types';

const TableEntityDataKeys = {
  LEFT_COL_BG_STYLE: 'leftColBgStyle',
  NO_BORDERS: 'noBorders',
  PADDING_SIZE: 'paddingSize',
  TOP_ROW_BG_STYLE: 'topRowBgStyle',
};

const LOCAL_CHANGE_ID = '_docs_table_cell_local_change';

function getEntityDataID(rowIndex: number, cellIndex: number): string {
  return 'cell_' + rowIndex + '_' + cellIndex;
}

// These are the very naive implementation of functions that update rows.
// Need a better way of doing this.
function insertRow(
  entityData: TableEntityData,
  rowIndex: number,
  before: boolean,
): TableEntityData {
  const {rowsCount, colsCount} = entityData;
  const newEntityData = {
    rowsCount: rowsCount + 1,
    colsCount,
  };
  let rr = 0;
  entityData = JSON.parse(JSON.stringify(entityData));
  const jj = before ? rowIndex : rowIndex + 1;
  const kk =  newEntityData.rowsCount;
  while (rr < kk) {
    let cc = 0;
    while (cc < colsCount) {
      const id = getEntityDataID(rr, cc);
      const data = entityData[id] || {};
      delete data[LOCAL_CHANGE_ID];
      if (rr < jj) {
        newEntityData[id] = data;
      } else {
        const newID = getEntityDataID(rr + 1, cc);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }
  return newEntityData;
}

function insertRowAfter(
  entityData: TableEntityData,
  rowIndex: number,
  colIndex: number,
): TableEntityData {
  return insertRow(entityData, rowIndex, false);
}

function insertRowBefore(
  entityData: TableEntityData,
  rowIndex: number,
  colIndex: number,
): TableEntityData {
  return insertRow(entityData, rowIndex, true);
}

function deleteRow(
  entityData: TableEntityData,
  rowIndex: number,
  colIndex: number,
): TableEntityData {
  const {rowsCount, colsCount} = entityData;
  if (rowsCount <= 1) {
    return entityData;
  }
  const newEntityData = {
    rowsCount: rowsCount - 1,
    colsCount,
  };
  let rr = 0;
  const kk =  newEntityData.rowsCount;
  while (rr < kk) {
    let cc = 0;
    while (cc < colsCount) {
      const id = getEntityDataID(rr, cc);
      const data = {...entityData[id]};
      if (rr < rowIndex) {
        newEntityData[id] = data;
      } else if (rr > rowIndex) {
        const newID = getEntityDataID(rr - 1, cc);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }
  return newEntityData;
}

function deleteColumn(
  entityData: TableEntityData,
  rowIndex: number,
  colIndex: number,
): TableEntityData {
  const {rowsCount, colsCount} = entityData;
  if (colsCount <= 1) {
    return entityData;
  }
  entityData = JSON.parse(JSON.stringify(entityData));
  const newEntityData = {
    rowsCount,
    colsCount: colsCount - 1,
    colWidths: null,
  };
  const kk =  newEntityData.colsCount;
  let rr = 0;
  while (rr < rowsCount) {
    let cc = 0;
    while (cc < kk) {
      const id = getEntityDataID(rr, cc);
      const data = entityData[id];
      if (cc < colIndex) {
        newEntityData[id] = data;
      } else if (cc > colIndex) {
        const newID = getEntityDataID(rr, cc - 1);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }

  // Allocate width to sibling column.
  const {colWidths} = entityData;
  let newColWidths;
  if (Array.isArray(colWidths) && colWidths.length === colsCount) {
    const deletedWidth = colWidths[colIndex];
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
  // $FlowFixMe
  newEntityData.colWidths = newColWidths;
  return newEntityData;
}

function insertColumn(
  entityData: TableEntityData,
  colIndex: number,
  before: boolean,
): TableEntityData {
  const {rowsCount, colsCount} = entityData;
  const newEntityData = {
    colWidths: null,
    colsCount: colsCount + 1,
    rowsCount,
  };
  let rr = 0;
  entityData = JSON.parse(JSON.stringify(entityData));

  const kk =  newEntityData.colsCount;
  while (rr < rowsCount) {
    let cc = 0;
    while (cc < kk) {
      const jj = before ? colIndex  : colIndex + 1;
      const id = getEntityDataID(rr, cc);
      const data = entityData[id] || {};
      delete data[LOCAL_CHANGE_ID];
      if (cc < jj) {
        newEntityData[id] = data;
      } else {
        const newID = getEntityDataID(rr, cc + 1);
        newEntityData[newID] = data;
      }
      cc++;
    }
    rr++;
  }

  // Allocate width to sibling column.
  const {colWidths} = entityData;
  let newColWidths;
  if (Array.isArray(colWidths) && colWidths.length === colsCount) {
    const newWidth = colWidths[colIndex] / 2;
    newColWidths = colWidths.slice(0);
    newColWidths[colIndex] = newWidth;
    newColWidths.splice(colIndex, 0, newWidth);
  }
  // $FlowFixMe
  newEntityData.colWidths = newColWidths;
  return newEntityData;
}

function insertColumnAfter(
  entityData: TableEntityData,
  rowIndex: number,
  colIndex: number,
): TableEntityData {
  return insertColumn(entityData, colIndex, false);
}

function insertColumnBefore(
  entityData: TableEntityData,
  rowIndex: number,
  colIndex: number,
): TableEntityData {
  return insertColumn(entityData, colIndex, true);
}

function toggleIndexColumnBackground(
  entityData: TableEntityData,
): TableEntityData {
  const key = TableEntityDataKeys.LEFT_COL_BG_STYLE;
  const value = !entityData[key];
  return {
    ...entityData,
    leftColBgStyle: value ? 'dark' : undefined,
  };
}

function toggleHeaderBackground(
  entityData: TableEntityData,
): TableEntityData {
  const key = TableEntityDataKeys.TOP_ROW_BG_STYLE;
  const value = !entityData[key];
  return {
    ...entityData,
    [key]: value ? 'dark' : undefined,
  };
}

function toggleBorders(
  entityData: TableEntityData,
): TableEntityData {
  const key = TableEntityDataKeys.NO_BORDERS;
  const value = !entityData[key];
  const v = {
    ...entityData,
    [key]: value ? true : undefined,
  };
  return v;
}

function togglePaddings(
  entityData: TableEntityData,
): TableEntityData {
  const key = TableEntityDataKeys.PADDING_SIZE;
  const value = !entityData[key];
  return {
    ...entityData,
    paddingSize: value ? 'large' : undefined,
  };
}

module.exports = {
  LOCAL_CHANGE_ID,
  TableEntityDataKeys,
  deleteColumn,
  deleteRow,
  getEntityDataID,
  insertColumnAfter,
  insertColumnBefore,
  insertRowAfter,
  insertRowBefore,
  toggleBorders,
  toggleHeaderBackground,
  toggleIndexColumnBackground,
  togglePaddings,
};
