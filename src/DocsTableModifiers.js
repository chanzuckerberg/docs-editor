// @flow

import type {DocsTableEntityData} from './Types';

const DocsTableEntityDataKeys = {
  LEFT_COL_BG_STYLE: 'leftColBgStyle',
  NO_BORDERS: 'noBorders',
  PADDING_SIZE: 'paddingSize',
  TOP_ROW_BG_STYLE: 'topRowBgStyle',
};

const LOCAL_CHANGE_ID = '_docs_table_cell_local_change';

function getEntityDataID(rowIndex: number, cellIndex: number): string {
  return 'cell_' + rowIndex + '_' + cellIndex;
}

function shiftCell(
  entityData: DocsTableEntityData,
  fromID: string,
  toID: string,
): DocsTableEntityData {
  const {cellBgStyles, cellColSpans, cellRowSpans} = entityData;
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
function insertRow(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
  before: boolean,
): DocsTableEntityData {

  let newEntityData = {
    ...entityData,
    rowsCount: entityData.rowsCount + 1,
  };

  const {
    colsCount,
    rowsCount,
    rowHeights,
  } = newEntityData;

  const start = before ? rowIndex : rowIndex + 1;
  const end = rowsCount;
  let rr = end;
  while (rr > start) {
    let cc = 0;
    while (cc < colsCount) {
      const fromID = getEntityDataID(rr - 1, cc);
      const toID = getEntityDataID(rr, cc);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc++;
    }
    if (rowHeights) {
      const prevHeight = rowHeights[rr - 1];
      if (prevHeight) {
        rowHeights[rr] = prevHeight;
        delete rowHeights[rr - 1];
      }
    }
    rr--;
  }
  return newEntityData;
}

function insertRowAfter(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
): DocsTableEntityData {
  return insertRow(entityData, rowIndex, colIndex, false);
}

function insertRowBefore(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
): DocsTableEntityData {
  return insertRow(entityData, rowIndex, colIndex, true);
}

function deleteRow(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
  before: boolean,
): DocsTableEntityData {
  if (entityData.rowsCount <= 1) {
    return entityData;
  }

  let newEntityData = {
    ...entityData,
    rowsCount: entityData.rowsCount - 1,
  };
  const {
    colsCount,
    rowsCount,
    rowHeights,
  } = newEntityData;
  let rr = rowIndex;
  while (rr < rowsCount) {
    let cc = 0;
    while (cc < colsCount) {
      const fromID = getEntityDataID(rr + 1, cc);
      const toID = getEntityDataID(rr, cc);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc++;
    }
    if (rowHeights) {
      const nextHeight = rowHeights[rr + 1];
      if (nextHeight) {
        rowHeights[rr] = nextHeight ;
        delete rowHeights[rr + 1];
      }
    }
    rr++;
  }
  return newEntityData;
}

function xxxxdeleteRow(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
): DocsTableEntityData {
  const {rowsCount, colsCount} = entityData;
  if (rowsCount <= 1) {
    return entityData;
  }
  const newEntityData = {
    ...entityData,
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
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
): DocsTableEntityData {
  let newEntityData = {
    ...entityData,
    colsCount: entityData.colsCount - 1,
  };
  const {
    rowsCount,
    colsCount,
    colWidths,
  } = newEntityData;
  const start = colIndex;
  const end = colsCount;
  let rr = 0;
  while (rr < rowsCount) {
    let cc = start;
    while (cc < end) {
      const fromID = getEntityDataID(rr, cc);
      const toID = getEntityDataID(rr, cc - 1);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc++;
    }
    rr++;
  }

  // Re-allocate width to sibling column.
  if (Array.isArray(colWidths) && colWidths.length === (colsCount - 1)) {
    const newWidth = colWidths[colIndex] / 2;
    const newColWidths = colWidths.slice(0);
    newColWidths[colIndex] = newWidth;
    newColWidths.splice(colIndex, 0, newWidth);
    newEntityData.colWidths = newColWidths;
  } else {
    delete newEntityData.colWidths;
  }

  // Allocate width to sibling column.
  if (Array.isArray(colWidths) && colWidths.length === colsCount) {
    const deletedWidth = colWidths[colIndex];
    let newColWidths = colWidths.slice(0);
    newColWidths.splice(colIndex, 1);
    if (newColWidths[colIndex - 1]) {
      newColWidths[colIndex - 1] += deletedWidth;
    } else if (newColWidths[colIndex - 1]) {
      newColWidths[colIndex + 1] += deletedWidth;
    } else {
      newColWidths = undefined;
    }
    newEntityData.colWidths = newColWidths;
  } else {
    delete newEntityData.colWidths;
  }
  return newEntityData;
}

function insertColumn(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
  before: boolean,
): DocsTableEntityData {
  let newEntityData = {
    ...entityData,
    colsCount: entityData.colsCount + 1,
  };
  const {
    rowsCount,
    colsCount,
    colWidths,
  } = newEntityData;
  const start = before ? colIndex : colIndex + 1;
  const end = colsCount;
  let rr = 0;
  while (rr < rowsCount) {
    let cc = end;
    while (cc > start) {
      const fromID = getEntityDataID(rr, cc - 1);
      const toID = getEntityDataID(rr, cc);
      newEntityData = shiftCell(newEntityData, fromID, toID);
      cc--;
    }
    rr++;
  }

  // Re-allocate width to sibling column.
  if (Array.isArray(colWidths) && colWidths.length === (colsCount - 1)) {
    const newWidth = colWidths[colIndex] / 2;
    const newColWidths = colWidths.slice(0);
    newColWidths[colIndex] = newWidth;
    newColWidths.splice(colIndex, 0, newWidth);
    newEntityData.colWidths = newColWidths;
  } else {
    delete newEntityData.colWidths;
  }

  return newEntityData;
}

function insertColumnAfter(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
): DocsTableEntityData {
  return insertColumn(entityData, rowIndex, colIndex, false);
}

function insertColumnBefore(
  entityData: DocsTableEntityData,
  rowIndex: number,
  colIndex: number,
): DocsTableEntityData {
  return insertColumn(entityData, rowIndex, colIndex, true);
}

function toggleIndexColumnBackground(
  entityData: DocsTableEntityData,
): DocsTableEntityData {
  const key = DocsTableEntityDataKeys.LEFT_COL_BG_STYLE;
  const value = !entityData[key];
  return {
    ...entityData,
    leftColBgStyle: value ? 'dark' : undefined,
  };
}

function toggleHeaderBackground(
  entityData: DocsTableEntityData,
  forceEnabled?: ?boolean,
): DocsTableEntityData {
  const key = DocsTableEntityDataKeys.TOP_ROW_BG_STYLE;
  const value = forceEnabled || !entityData[key];
  const bgStyle = value ? 'dark' : undefined;
  if (entityData[key] === bgStyle) {
    return entityData;
  }
  return {
    ...entityData,
    [key]: bgStyle,
  };
}

function toggleBorders(
  entityData: DocsTableEntityData,
): DocsTableEntityData {
  const key = DocsTableEntityDataKeys.NO_BORDERS;
  const value = !entityData[key];
  const v = {
    ...entityData,
    [key]: value ? true : undefined,
  };
  return v;
}

function togglePaddings(
  entityData: DocsTableEntityData,
): DocsTableEntityData {
  const key = DocsTableEntityDataKeys.PADDING_SIZE;
  const value = !entityData[key];
  return {
    ...entityData,
    paddingSize: value ? 'large' : undefined,
  };
}

module.exports = {
  LOCAL_CHANGE_ID,
  DocsTableEntityDataKeys,
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
