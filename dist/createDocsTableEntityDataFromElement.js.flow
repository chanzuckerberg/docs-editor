// @flow

import type {DocsTableEntityData, DocumentLike, ElementLike, HTMLCollectionLike} from './Types';

import type {CSSRules} from './getCSSRules';
import Color from 'color';
import DocsCustomStyleMap from './DocsCustomStyleMap';
import {EditorState} from 'draft-js';
import type {SafeHTML} from './getSafeHTML';
import asElement from './asElement';
import asNumber from './asNumber';
import convertToRaw from './convertToRaw';
import createEmptyEditorState from './createEmptyEditorState';
import {getEntityDataID} from './DocsTableModifiers';
import getSafeHTML from './getSafeHTML';
import invariant from 'invariant';
import {toggleHeaderBackground} from './DocsTableModifiers';

type convertFromHTML = (
  html: string,
  editorState?: ?EditorState,
  domDocument?: ?DocumentLike,
  cssRules?: ?CSSRules,
) => EditorState;

function setDocsTableEntityDataFromCell(
  safeHTML: SafeHTML,
  row: ElementLike,
  cell: ElementLike,
  convertFromHTML: convertFromHTML,
  entityData: DocsTableEntityData
): DocsTableEntityData {
  let newEntityData = entityData;
  const {colsCount, rowsCount} = entityData;
  const rowIndex = asNumber(row.rowIndex);
  const cellIndex = asNumber(cell.cellIndex);
  const {classList, nodeName, innerHTML, colSpan, rowSpan} = cell;
  if (rowIndex === 0 && nodeName === 'TH') {
    newEntityData = toggleHeaderBackground(newEntityData, true);
  }
  const cellEditorState = convertFromHTML(
    innerHTML,
    null, // TODO: Find a way to get the editor state.
    row.ownerDocument,
    safeHTML.cssRules,
  );

  const id = getEntityDataID(rowIndex, cellIndex);
  newEntityData[id] = convertToRaw(cellEditorState);

  if (colSpan && colSpan > 1) {
    const cellColSpans = newEntityData.cellColSpans || {};
    cellColSpans[id] = Math.min(
      colSpan,
      colsCount - cellIndex,
    );
    newEntityData.cellColSpans = cellColSpans;
  }

  if (rowSpan && rowSpan > 1) {
    const cellRowSpans = newEntityData.cellRowSpans || {};
    cellRowSpans[id] = Math.min(
      rowSpan,
      rowsCount - rowIndex,
    );
    newEntityData.cellRowSpans = cellRowSpans;
  }

  if (!classList || !classList.length) {
    return newEntityData;
  }

  // The table-cell might have a className that can be mapped to the custom
  // style. Find out what that className is.
  classList.forEach(cellClassName => {
    const selector = `.${cellClassName}`;
    const styleMap = safeHTML.cssRules.get(selector);
    if (styleMap) {
      let borderColor = undefined;
      styleMap.forEach((styleValue, styleName) => {
        if (styleName === 'background-color') {
          const customClassName =
            DocsCustomStyleMap.forBackgroundColor(styleValue);
          if (customClassName) {
            const cellBgStyles = newEntityData.cellBgStyles || {};
            cellBgStyles[id] = customClassName;
            newEntityData.cellBgStyles = cellBgStyles;
          }
        } else if (styleName === 'width' && rowIndex === 0) {
          const colWidths = newEntityData.colWidths || [];
          const width: any = styleValue;
          colWidths[cellIndex] = width;
          newEntityData.colWidths = colWidths;
        } else if (
          styleName === 'border-left-color' ||
          styleName === 'border-top-color' ||
          styleName === 'border-right-color' ||
          styleName === 'border-bottom-color'
        ) {
          if (borderColor === undefined) {
            borderColor = styleValue;
          } else if (borderColor !== styleValue) {
            borderColor = null;
          }
        }
      });

      // If all cells have the same white border, hides the border.
      if (
        newEntityData.noBorders !== false &&
        borderColor &&
        Color(borderColor).hex() === '#FFFFFF'
      ) {
        newEntityData.noBorders = true;
      } else {
        newEntityData.noBorders = false;
      }
    }
  });

  return newEntityData;
}

function setDocsTableEntityDataFromRow(
  safeHTML: SafeHTML,
  row: ElementLike,
  convertFromHTML: convertFromHTML,
  entityData: DocsTableEntityData
): DocsTableEntityData {
  const {cells, classList, rowIndex} = row;
  if (!cells || !cells.length) {
    return entityData;
  }
  let newEntityData = entityData;
  for (let ii = 0, jj = cells.length; ii < jj; ii++) {
    const cell = cells[ii];
    if (cell) {
      newEntityData = setDocsTableEntityDataFromCell(
        safeHTML,
        row,
        cell,
        convertFromHTML,
        entityData,
      );
    }
  }

  if (!classList || !classList.length) {
    return newEntityData;
  }

  // The table-cell might have a className that can be mapped to the custom
  // style. Find out what that className is.
  classList.forEach(cellClassName => {
    const selector = `.${cellClassName}`;
    const styleMaps = safeHTML.cssRules.get(selector);
    if (styleMaps) {
      styleMaps.forEach((styleValue, styleName) => {
        if (styleName === 'height') {
          let height = 0;
          if (styleValue.indexOf('pt') > 0) {
            height = parseInt(styleValue, 10);
          } else if (styleValue.indexOf('px') > 0) {
            height = parseInt(styleValue, 10);
          }

          if (height) {
            const rowHeights = newEntityData.rowHeights || {};
            rowHeights[asNumber(row.rowIndex)] = asNumber(height);
            newEntityData.rowHeights = rowHeights;
          }
        }
      });
    }
  });

  return newEntityData;
}

function getRowsCount(rows: ?HTMLCollectionLike): number {
  return (rows && rows.length) || 0;
}

function getColsCount(rows: ?HTMLCollectionLike): number {
  const firstRow = rows ? rows[0] : null;
  if (!firstRow) {
    return 0;
  }
  const {cells} = firstRow;
  if (!cells || !cells.length) {
    return 0;
  }
  return Math.max(0, Array.from(cells).reduce((sum, cell) => {
    sum++;
    if (cell && cell.colSpan && cell.colSpan > 1) {
      sum += cell.colSpan - 1;
    }
    return sum;
  }, 0));
}


function createDocsTableEntityDataFromElement(
  safeHTML: SafeHTML,
  table: ElementLike,
  convertFromHTML: convertFromHTML,
): DocsTableEntityData {
  invariant(table.nodeName === 'TABLE', 'must be a table');
  let entityData: any = {
    rowsCount: 0,
    colsCount: 0,
    cellColSpans: {},
    cellRowSpans: {},
    cellBgStyles: {},
  };

  // The children of `table` should have been quarantined. We need to access
  // the children from the quarantine pool.
  const el = asElement(safeHTML.unsafeNodes.get(asElement(table).id));

  // TODO: What about having multiple <tbody />, <thead /> and <col />
  // colsSpan, rowsSpan...etc?
  const {rows} = el;

  const rowsCount = getRowsCount(rows);
  const colsCount = getColsCount(rows);
  if (rowsCount === 0 || colsCount === 0) {
    return entityData;
  }

  entityData.rowsCount = rowsCount;
  entityData.colsCount = colsCount;
  let rr = 0;
  let useHeader = false;
  if (rows) {
    while (rr < rowsCount) {
      const row =  rows[rr];
      if (row) {
        entityData = setDocsTableEntityDataFromRow(
          safeHTML,
          row,
          convertFromHTML,
          entityData,
        );
      }
      rr++;
    }
  }
  entityData.colWidths = convertColumnWidthToPercentageNumbers(entityData);
  return entityData;
}

function convertColumnWidthToPercentageNumbers(
  entityData: DocsTableEntityData
): ?Array<number> {
  const {colWidths, colsCount} = entityData;
  if (
    !Array.isArray(colWidths) ||
    colWidths.length === 0 ||
    colWidths.length !== colsCount
  ) {
    return null;
  }
  const unitValuePattern = /[\.\d]/g;
  const firstWidth = String(colWidths[0]);
  const totalWidth = colWidths.reduce((sum, width, ii) => {
    const currentWidth = String(width);
    const currentUnit = currentWidth.replace(unitValuePattern, '');
    if (ii > 1) {
      const prevWidth = String(colWidths[ii - 1]);
      const prevUnit = prevWidth.replace(unitValuePattern, '');
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

  return colWidths.map(w => {
    const decimal = parseFloat(w) / totalWidth;
    return Math.round(decimal * 1000) / 1000;
  });
}

export default createDocsTableEntityDataFromElement;
