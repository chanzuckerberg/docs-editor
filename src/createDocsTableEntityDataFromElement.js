// @flow

import Color from 'color';
import DocsCustomStyleMap from './DocsCustomStyleMap';
import asElement from './asElement';
import asNumber from './asNumber';
import convertToRaw from './convertToRaw';
import createEmptyEditorState from './createEmptyEditorState';
import getSafeHTML from './getSafeHTML';
import invariant from 'invariant';

import {EditorState} from 'draft-js';
import {getEntityDataID} from './DocsTableModifiers';
import {toggleHeaderBackground} from './DocsTableModifiers';

import type {DocsTableEntityData, ElementLike, DocumentLike} from './Types';
import type {SafeHTML} from './getSafeHTML';
import type {CSSRules} from './getCSSRules';

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
  const rowIndex = asNumber(row.rowIndex);
  const cellIndex = asNumber(cell.cellIndex);
  const {classList, nodeName, innerHTML, colSpan, rowSpan} = cell;
  if (rowIndex === 0 && nodeName === 'TH') {
    newEntityData.topRowBgStyle = 'dark';
    // newEntityData = toggleHeaderBackground(newEntityData, true);
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
    cellColSpans[id] = colSpan;
    newEntityData.cellColSpans = cellColSpans;
  }

  if (rowSpan && rowSpan > 1) {
    const cellRowSpans = newEntityData.cellRowSpans || {};
    cellRowSpans[id] = rowSpan;
    newEntityData.cellRowSpans = cellRowSpans;
  }

  if (!classList || !classList.length) {
    return newEntityData;
  }

  // The table-cell might have a className that can be mapped to the custom
  // background color. Find out what that className is.
  classList.forEach(cellClassName => {
    const selector = `.${cellClassName}`;
    const rules = safeHTML.cssRules.get(selector);
    if (rules) {
      rules.forEach((styleValue, styleName) => {
        if (styleName === 'background-color') {
          const customClassName =
            DocsCustomStyleMap.forBackgroundColor(styleValue);
          if (customClassName) {
            const cellBgStyles = newEntityData.cellBgStyles || {};
            cellBgStyles[id] = customClassName;
            newEntityData.cellBgStyles = cellBgStyles;
          }
        }
      });
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
  const {cells} = row;
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
  return newEntityData;
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

  if (
    !rows ||
    !rows[0] ||
    !rows[0].cells ||
    rows[0].cells.length === 0
  ) {
    return entityData;
  }

  const rowsCount = rows ? rows.length : 0;
  const colsCount = Array.from(rows).reduce(
    (max, row) => {
      if (row && row.cells) {
        const len = row.cells.length;
        return len > max ? len : max;
      }
      return max;
    },
    0,
  );

  entityData.rowsCount = rowsCount;
  entityData.colsCount = colsCount;
  let rr = 0;
  let useHeader = false;
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

  return entityData;
}

export default createDocsTableEntityDataFromElement;
