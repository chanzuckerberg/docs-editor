// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsTableCell from './DocsTableCell';
import DocsTableModifiers from './DocsTableModifiers';
import React from 'react';
import cx from 'classnames';
import withDocsContext from './withDocsContext';
import {EditorState} from 'draft-js';
import {getEntityDataID} from './DocsTableModifiers';
import {updateEntityData} from './DocsModifiers';

import type {DocsTableEntityData} from './Types';

type Props = {
  editorCellIndex: number,
  editorRowIndex: number,
  editorState: EditorState,
  entity: Object,
  entityKey: string,
  onChange: (e: EditorState) => void,
  resizable: boolean,
  rowIndex: number,
};

const {DocsTableEntityDataKeys} = DocsTableModifiers;

class DocsTableRow extends React.PureComponent {

  props: Props;

  render(): React.Element<any> {
    const {canEdit} = this.context.docsContext;

    const {
      entity,
      rowIndex,
      editorRowIndex,
      editorCellIndex,
      resizable,
    } = this.props;

    const entityData: DocsTableEntityData = entity.getData();
    const {
      colsCount,
      colWidths,
      cellColSpans,
      cellRowSpans,
      cellBgStyles,
    } = entityData;
    let cellsCount = colsCount;

    if (cellColSpans) {
      let ci = 0;
      while (ci < colsCount) {
        const cid = getEntityDataID(rowIndex, ci);
        const colSpan = cellColSpans[cid];
        if (colSpan && colSpan > 1) {
          cellsCount = cellsCount - colSpan + 1;
        }
        if (cellRowSpans) {
          let ri = rowIndex - 1;
          if (ri > -1) {
            let ri = rowIndex - 1;
            while (ri > -1) {
              const rid = getEntityDataID(ri, ci);
              const rowSpan = cellRowSpans[rid];
              if (rowSpan && rowSpan > 1) {
                if ((ri + rowSpan - 1) >= rowIndex) {
                  cellsCount -= 1;
                }
                break;
              }
              ri--;
            }
          }
        }
        ci++;
      }
    }


    const cells = [];
    const rr = rowIndex;
    let cc = 0;
    while (cc < cellsCount) {
      const id = getEntityDataID(rr, cc);
      const rawContentState = entityData[id];
      const highlighted = (
        canEdit &&
        rr === editorRowIndex &&
        cc === editorCellIndex
      );
      let bgStyle = cc === 0 ? entityData.leftColBgStyle : null;
      if (rowIndex == 0 && entityData.topRowBgStyle) {
        bgStyle = entityData.topRowBgStyle;
      }
      let bgColor = null;
      if (cellBgStyles && cellBgStyles[id]) {
        bgStyle = cellBgStyles[id];
      }

      const colSpan = (cellColSpans && cellColSpans[id]) || 1;
      const rowSpan = (cellRowSpans && cellRowSpans[id]) || 1;
      cells.push(
        <DocsTableCell
          bgStyle={bgStyle}
          cellIndex={cc}
          colSpan={colSpan}
          colsCount={colsCount}
          highlighted={highlighted}
          key={id}
          onChange={this._onCellEditChange}
          onColumnResizeEnd={this._onColumnResizeEnd}
          paddingSize={entityData[DocsTableEntityDataKeys.PADDING_SIZE]}
          rawContentState={rawContentState}
          resizable={resizable}
          rowIndex={rr}
          rowSpan={rowSpan}
          width={colWidths && colWidths[cc]}
        />
      );
      cc++;
    }
    const className = cx({
      'docs-table-row': true,
      'docs-table-row-header':
        rr === 0 && !!entityData[DocsTableEntityDataKeys.TOP_ROW_BG_STYLE],
    });
    const attrs = {
      [DocsDataAttributes.ELEMENT]: true,
      [DocsDataAttributes.TABLE_ROW]: true,
    };
    return (
      <tr {...attrs} className={className}>
        {cells}
      </tr>
    );
  }

  _onCellEditChange = (
    rowIndex: number,
    colIndex: number,
    cellData: Object
  ): void => {
    const {editorState, onChange, entity, entityKey} = this.props;
    const entityData = entity.getData();
    const newEntityData = {...entityData};
    const id = getEntityDataID(rowIndex, colIndex);
    newEntityData[id] = cellData;
    const newEditorState = updateEntityData(
      editorState,
      entityKey,
      newEntityData,
    );
    onChange(newEditorState);
  }

  _onColumnResizeEnd = (colWidths: Array<number>) => {
    const {editorState, onChange, entity, entityKey} = this.props;
    const entityData = entity.getData();
    const newEntityData = {
      ...entityData,
      colWidths,
    };
    const newEditorState = updateEntityData(
      editorState,
      entityKey,
      newEntityData
    );
    onChange(newEditorState);
  };
}

module.exports = withDocsContext(DocsTableRow);
