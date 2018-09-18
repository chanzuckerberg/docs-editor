// @flow

import DocsBaseEditor from './DocsBaseEditor';
import DocsDataAttributes from './DocsDataAttributes';
import DocsTableCellResizeHandle from './DocsTableCellResizeHandle';
import React from 'react';
import Timer from './Timer';
import convertFromRaw from './convertFromRaw';
import convertToRaw from './convertToRaw';
import cx from 'classnames';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {EditorState} from 'draft-js';
import {LOCAL_CHANGE_ID} from './DocsTableModifiers';

type Props = {
  bgStyle?: ?string,
  cellIndex: number,
  colSpan: number,
  colsCount: number,
  highlighted: boolean,
  onChange: (i: number, j: number, s: Object) => void,
  onColumnResizeEnd: (v: Array<number>) => void,
  paddingSize: ?string,
  rawContentState: ?Object,
  resizable: boolean,
  rowIndex: number,
  rowSpan: number,
  width?: ?number,
};

function getLocalEditorState(props: Props): EditorState {
  const {rawContentState} = props;
  return convertFromRaw(rawContentState);
}

class DocsTableCell extends React.PureComponent {

  _editor = null;
  _editorID = uniqueID();
  _localChangeID = null;
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

    if (
      this._localChangeID &&
      rawContentState &&
      rawContentState[LOCAL_CHANGE_ID] === this._localChangeID
    ) {
      return;
    }
    this._timer.clear();
    this.setState({
      localEditorState: getLocalEditorState(nextProps),
    });
  }

  componentDidUpdate(): void {
    this._localChangeID = uniqueID();
  }

  componentWillUnmount(): void {
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const {canEdit} = this.context.docsContext;

    const {
      colSpan, rowSpan,
      cellIndex, rowIndex, highlighted, resizable, colsCount,
      onColumnResizeEnd, width, bgStyle, paddingSize,
    } = this.props;
    const editorID = this._editorID;

    // $FlowFixMe: can't assign key `bgStyle`.
    const className = cx({
      'docs-table-cell': true,
      'docs-table-cell-highlighted': highlighted,
      'docs-table-cell-with-bg-style': !!bgStyle,
      'docs-table-cell-with-padding-large': paddingSize === 'large',
      [bgStyle]: !!bgStyle,
    });

    const leftHandle =
      (canEdit && resizable && cellIndex > 0) ?
      <DocsTableCellResizeHandle
        key="r1"
        onColumnResizeEnd={onColumnResizeEnd}
        position="left"
      /> :
      null;

    const effectiveColspan = colSpan || 1;
    const rightHandle =
      (canEdit && resizable && (cellIndex < (colsCount - 1))) ?
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
        colSpan={colSpan}
        className={className}
        rowSpan={rowSpan}
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
    this._localChangeID = uniqueID();
    const currContentState = this.state.localEditorState.getCurrentContent();
    const nextContentState = localEditorState.getCurrentContent();
    this.setState({localEditorState}, () => {
      if (currContentState !== nextContentState) {
        // Do not notify changes unless the content did change.
        this._notifyChange();
      }
    });
  };

  _notifyChange = () => {
    if (!this.context.docsContext.canEdit) {
      return;
    }
    this._timer.clear();
    this._timer.set(this._notifyChangeImmediate, 160);
  };

  _notifyChangeImmediate = () => {
    this._timer.clear();
    if (!this._editor) {
      // Unmounted.
      return;
    }
    const {cellIndex, onChange, rowIndex} = this.props;
    const {localEditorState} = this.state;
    const rawContentState = convertToRaw(localEditorState);
    rawContentState[LOCAL_CHANGE_ID] = this._localChangeID;
    onChange(rowIndex, cellIndex, rawContentState);
  };
}

module.exports = withDocsContext(DocsTableCell);
