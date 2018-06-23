// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsEventTypes from './DocsEventTypes';
import DocsTableModifiers from './DocsTableModifiers';
import DocsTableRow from './DocsTableRow';
import DocsTableToolbar from './DocsTableToolbar';
import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import docsWithContext from './docsWithContext';
import {ContentBlock, EditorState, Entity} from './DraftJS';

import type {BaseEditor} from './Types';

type Props = {
  block: ContentBlock,
  blockProps: {
    editorState: EditorState,
    entity: Entity,
    entityKey: string,
    onChange: (e: EditorState) => void,
  },
};

const {TableEntityDataKeys} = DocsTableModifiers;

class DocsTable extends React.PureComponent {
  _activeEditor = null;
  _element = null;
  _nodeListening: null;
  _table = null;

  props: Props;

  componentWillUnmount(): void {
    this._unlisten();
  }

  render(): React.Element<any> {
    const {blockProps} = this.props;
    const {entity, editorState, onChange, entityKey} = blockProps;
    const entityData = entity.getData();
    const {rowsCount} = entityData;
    const activeEditor = this._activeEditor;

    let editorRowIndex = -1;
    let editorCellIndex = -1;
    if (activeEditor) {
      const editorProps = activeEditor.props;
      editorRowIndex = editorProps.rowIndex;
      editorCellIndex = editorProps.cellIndex;
    }

    const rows = [];

    let rr = 0;
    // TODO: resizable should be checked with whether user has permission to do
    // so.
    while (rr < rowsCount) {
      rows.push(
        <DocsTableRow
          editorCellIndex={editorCellIndex}
          editorRowIndex={editorRowIndex}
          editorState={editorState}
          entity={entity}
          entityKey={entityKey}
          key={'row_' + rr}
          onChange={onChange}
          resizable={true}
          rowIndex={rr}
        />
      );
      rr++;
    }
    const editorID = activeEditor ? activeEditor.id : null;
    const className = cx({
      'docs-table-main': true,
      'docs-table-main-active': !!editorID,
      'docs-table-main-no-borders': entityData[TableEntityDataKeys.NO_BORDERS],
    });
    const attrs = {
      [DocsDataAttributes.EDITOR_FOR]: editorID,
    };
    const tableAttrs = {
      [DocsDataAttributes.ELEMENT]: true,
      [DocsDataAttributes.TABLE]: true,
    };
    return (
      <div
        {...attrs}
        className={className}
        contentEditable={false}
        ref={this._onElementRef}>
        <DocsTableToolbar
          editor={activeEditor}
          editorState={editorState}
          entity={entity}
          entityKey={entityKey}
          getEditor={this._getEditor}
          onChange={onChange}
        />
        <table
          {...tableAttrs}
          className="docs-table"
          ref={this._onTableRef}>
          <tbody className="docs-table-body">
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

  _onElementRef = (ref: any) => {
    this._unlisten();
    this._element = ref;
    this._listen();
  };

  _onTableRef = (ref: any) => {
    this._table = ref;
  };

  _onEditorIn = (event: any) => {
    let editor = event.detail ? event.detail.editor : null;

    if (editor) {
      const {rowIndex, cellIndex} = editor.props;
      if (isNaN(rowIndex) || isNaN(cellIndex)) {
        // from a non-celll editor.
        editor = null;
      }
    }

    if (editor !== null) {
      const {target} = event;
      const tableNode = this._table ? ReactDOM.findDOMNode(this._table) : null;
      if (tableNode) {
        let node = target;
        while (node) {
          if (
            node.nodeType === 1 &&
            node.getAttribute(DocsDataAttributes.TABLE)
          ) {
            if (node !== tableNode) {
              // Editor came from a nested table's editor.
              editor = null;
            }
            break;
          }
          node = node.parentNode;
        }
      } else {
        editor = null;
      }
    }

    // Hack. Need to expose this to state immediately.
    if (editor !== this._activeEditor) {
      this._activeEditor = editor;
      this.forceUpdate();
    }
  };

  _onEditorOut = (event: any) => {
    if (this._activeEditor) {
      this._activeEditor = null;
      this.forceUpdate();
    }
  };

  _getEditor = (): ?BaseEditor => {
    return this._activeEditor;
  };

  _listen(): void {
    if (!this.context.docsContext.canEdit) {
      return;
    }
    const node: any = this._element ?
      ReactDOM.findDOMNode(this._element) :
      null;
    if (node) {
      node.addEventListener(
        DocsEventTypes.EDITOR_IN,
        this._onEditorIn,
        false,
      );
      node.addEventListener(
        DocsEventTypes.EDITOR_OUT,
        this._onEditorOut,
        true,
      );
      this._nodeListening = node;
    }
  }

  _unlisten(): void {
    if (!this._nodeListening) {
      return;
    }
    const node = this._nodeListening;
    this._nodeListening = null;
    if (node) {
      node.removeEventListener(
        DocsEventTypes.EDITOR_IN,
        this._onEditorIn,
        false,
      );
      node.removeEventListener(
        DocsEventTypes.EDITOR_OUT,
        this._onEditorOut,
        true,
      );
    }
  }
}

module.exports = docsWithContext(DocsTable);
