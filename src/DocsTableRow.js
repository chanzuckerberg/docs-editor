// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsTableCell from './DocsTableCell';
import DocsTableModifiers from './DocsTableModifiers';
import React from 'react';
import cx from 'classnames';
import docsWithContext from './docsWithContext';
import {EditorState} from 'draft-js';
import {getEntityDataID} from './DocsTableModifiers';
import {updateEntityData} from './DocsModifiers';

import type {TableEntityData} from './Types';

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

const {TableEntityDataKeys} = DocsTableModifiers;

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

    const entityData: TableEntityData = entity.getData();
    const {colsCount, colWidths} = entityData;
    const cells = [];
    const rr = rowIndex;
    let cc = 0;
    while (cc < colsCount) {
      const id = getEntityDataID(rr, cc);
      const rawContentState = entityData[id];
      const highlighted = (
        canEdit &&
        rr === editorRowIndex &&
        cc === editorCellIndex
      );
      cells.push(
        <DocsTableCell
          bgStyle={cc === 0 ? entityData.leftColBgStyle : null}
          cellIndex={cc}
          colsCount={colsCount}
          highlighted={highlighted}
          key={id}
          onChange={this._onCellEditChange}
          onColumnResizeEnd={this._onColumnResizeEnd}
          paddingSize={entityData[TableEntityDataKeys.PADDING_SIZE]}
          rawContentState={rawContentState}
          resizable={resizable}
          rowIndex={rr}
          width={colWidths && colWidths[cc]}
        />
      );
      cc++;
    }
    const className = cx({
      'docs-table-row': true,
      'docs-table-row-header':
        rr === 0 && !!entityData[TableEntityDataKeys.TOP_ROW_BG_STYLE],
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

module.exports = docsWithContext(DocsTableRow);