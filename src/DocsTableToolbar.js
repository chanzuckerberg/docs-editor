// @flow

import DocsActionTypes from './DocsActionTypes';
import DocsTableMenu from './DocsTableMenu';
import DocsTableModifiers from './DocsTableModifiers';
import React from 'react';
import cx from 'classnames';
import docsWithContext from './docsWithContext';
import type {BaseEditor} from './Types';
import {ButtonGroup} from 'react-bootstrap';
import {EditorState} from './DraftJS';

type Props = {
  editorState: EditorState,
  entity: Object,
  entityKey: string,
  getEditor: () => ?BaseEditor,
  onChange: (e: EditorState) => void,
};

const {TableEntityDataKeys} = DocsTableModifiers;

const GRID_OPTIONS = [
  {
    action: DocsActionTypes.TABLE_INSERT_COLUMN_BEFORE,
    icon: 'border_left',
    label: 'Add Column Before',
    modifier: DocsTableModifiers.insertColumnBefore,
  },
  {
    action: DocsActionTypes.TABLE_INSERT_COLUMN_AFTER,
    icon: 'border_right',
    label: 'Add Column After',
    modifier: DocsTableModifiers.insertColumnAfter,
  },
  null,
  {
    action: DocsActionTypes.TABLE_INSERT_ROW_BEFORE,
    icon: 'border_top',
    label: 'Add Row Before',
    modifier: DocsTableModifiers.insertRowBefore,
  },
  {
    action: DocsActionTypes.TABLE_INSERT_ROW_AFTER,
    icon: 'border_bottom',
    label: 'Add Row After',
    modifier: DocsTableModifiers.insertRowAfter,
  },
  null,
  {
    action: DocsActionTypes.TABLE_DELETE_ROW,
    icon: 'border_horizontal',
    label: 'Delete Row',
    modifier: DocsTableModifiers.deleteRow,
  },
  {
    action: DocsActionTypes.TABLE_DELETE_COLUMN,
    icon: 'border_vertical',
    label: 'Delete Column',
    modifier: DocsTableModifiers.deleteColumn,
  },
];

const STYLE_OPTIONS = [
  {
    action: DocsActionTypes.TABLE_TOOGLE_HEADER_BACKGROUND,
    activeName: TableEntityDataKeys.TOP_ROW_BG_STYLE,
    label: 'Highlight Header',
    modifier: DocsTableModifiers.toggleHeaderBackground,
  },
  {
    action: DocsActionTypes.TABLE_TOOGLE_INDEX_COLUMN_BACKGROUND,
    activeName: TableEntityDataKeys.LEFT_COL_BG_STYLE,
    entityDataName: 'leftColBgStyle',
    label: 'Highlight First Column',
    modifier: DocsTableModifiers.toggleIndexColumnBackground,
  },
  {
    action: DocsActionTypes.TABLE_TOOGLE_BORDERS,
    activeName: TableEntityDataKeys.NO_BORDERS,
    label: 'Hide Borders',
    modifier: DocsTableModifiers.toggleBorders,
  },
  {
    action: DocsActionTypes.TABLE_TOOGLE_PADDINGS,
    activeName: TableEntityDataKeys.PADDING_SIZE,
    label: 'Larger Paddings',
    modifier: DocsTableModifiers.togglePaddings,
  },
];

class DocsTableToolbar extends React.PureComponent {
  props: Props;

  render(): ?React.Element<any> {
    if (!this.context.docsContext.canEdit) {
      return null;
    }
    const editor = this.props.getEditor();
    const className = cx({
      'docs-table-toolbar': true,
      'docs-table-toolbar-disabled': !editor,
    });
    const editorID = editor ? editor.id : null;
    return (
      <div className={className} data-docs-editor-for={editorID}>
        <ButtonGroup>
          <DocsTableMenu
            {...this.props}
            key="grid"
            options={GRID_OPTIONS}
            title="Grid"
          />
          {' '}
          <DocsTableMenu
            {...this.props}
            key="style"
            options={STYLE_OPTIONS}
            title="Styles"
          />
        </ButtonGroup>
      </div>
    );
  }
}

module.exports = docsWithContext(DocsTableToolbar);
