// @flow

import DocsBaseEditor from './DocsBaseEditor';
import DocsDataAttributes from './DocsDataAttributes';
import DocsTableCellResizeHandle from './DocsTableCellResizeHandle';
import React from 'react';
import Timer from '../lib/Timer';
import cx from 'classnames';
import convertFromRaw from './convertFromRaw';
import docsWithContext from './docsWithContext';
import {LOCAL_CHANGE_ID} from './DocsTableModifiers';
import {convertToRaw, EditorState} from 'draft-js';
import {uniqueID} from './DocsHelpers';

type Props = {
  bgStyle: ?string,
  cellIndex: number,
  colsCount: number,
  highlighted: boolean,
  onChange: (i: number, j: number, s: Object) => void,
  onColumnResizeEnd: (v: Array<number>) => void,
  paddingSize: ?string,
  rawContentState: ?Object,
  resizable: boolean,
  rowIndex: number,
  width?: ?number,
};

function getLocalEditorState(props: Props): EditorState {
  const {rawContentState} = props;
  return convertFromRaw(rawContentState);
}

class DocsTableCell extends React.PureComponent {

  _editor = null;
  _editorID = uniqueID();
  _localRawContentState = null;
  _timer = new Timer();

  props: Props;

  state = {
    localEditorState: getLocalEditorState(this.props),
  };

  componentWillReceiveProps(nextProps: Props): void {
    // Sync local editor state.
    const {rawContentState} = nextProps;
    if (this.props.rawContentState === rawContentState) {
      return;
    }
    const localRawContentState = this._localRawContentState;
    if (localRawContentState === rawContentState) {
      return;
    }
    const id1 = localRawContentState && localRawContentState[LOCAL_CHANGE_ID];
    const id2 = rawContentState && rawContentState[LOCAL_CHANGE_ID];
    if (id2 && id2 && id1 === id2) {
      return;
    }
    this._timer.clear();
    this.setState({
      localEditorState: getLocalEditorState(nextProps),
    });
  }

  componentWillUnmount(): void {
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const {canEdit} = this.context.docsContext;

    const {
      cellIndex, rowIndex, highlighted, resizable, colsCount,
      onColumnResizeEnd, width, bgStyle, paddingSize,
    } = this.props;
    const editorID = this._editorID;
    const className = cx({
      'docs-table-cell': true,
      'docs-table-cell-highlighted': highlighted,
      'docs-table-cell-with-bg-style': !!bgStyle,
      'docs-table-cell-with-padding-large': paddingSize === 'large',
    });

    const leftHandle =
      (canEdit && resizable && cellIndex > 0 && rowIndex >= 0) ?
      <DocsTableCellResizeHandle
        key="r1"
        onColumnResizeEnd={onColumnResizeEnd}
        position="left"
      /> :
      null;

    const rightHandle =
      (resizable && cellIndex < (colsCount - 1) && rowIndex === 0) ?
      <DocsTableCellResizeHandle
        key="r2"
        onColumnResizeEnd={onColumnResizeEnd}
        position="right"
      /> :
      null;

    let style = null;
    if (rowIndex === 0 && typeof width === 'number' && !isNaN(width)) {
      style = {width: (width * 100) + '%'};
    }

    const attrs = {
      [DocsDataAttributes.EDITOR_FOR]: editorID,
      [DocsDataAttributes.ELEMENT]: true,
      [DocsDataAttributes.TABLE_CELL]: true,
    };
    return (
      <td
        {...attrs}
        className={className}
        style={style}>
        <DocsBaseEditor
          cellIndex={cellIndex}
          editorState={this.state.localEditorState}
          id={editorID}
          onChange={this._onChange}
          ref={this._onEditorRef}
          rowIndex={rowIndex}
        />
        {leftHandle}
        {rightHandle}
      </td>
    );
  }

  _onEditorRef = (ref: any): void => {
    this._editor = ref;
  };

  _onChange = (localEditorState: EditorState): void => {
    if (!this.context.docsContext.canEdit) {
      return;
    }
    // Effectively and optimistically commit change locally then sync later.
    this.setState({localEditorState}, this._notifyChange);
  };

  _notifyChange = () => {
    if (!this.context.docsContext.canEdit) {
      return;
    }
    this._timer.set(this._notifyChangeImmediate, 250);
  };

  _notifyChangeImmediate = () => {
    this._timer.clear();
    if (!this._editor) {
      // Unmounted.
      return;
    }
    const {cellIndex, onChange, rowIndex} = this.props;
    const {localEditorState} = this.state;
    const contentState = localEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    rawContentState[LOCAL_CHANGE_ID] = uniqueID();
    this._localRawContentState = rawContentState;
    onChange(rowIndex, cellIndex, rawContentState);
  };
}

module.exports = docsWithContext(DocsTableCell);
