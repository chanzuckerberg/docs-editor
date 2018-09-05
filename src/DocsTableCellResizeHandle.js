// @flow

import DocsDataAttributes from './DocsDataAttributes';
import React from 'react';
import asElement from './asElement';
import asNumber from './asNumber';
import captureDocumentEvents from './captureDocumentEvents';
import cx from 'classnames';
import lookupElementByAttribute from './lookupElementByAttribute';
import lookupResizeableTableCellElement from './lookupResizeableTableCellElement';

type Props = {
  onColumnResizeEnd: (w: Array<number>) => void,
  position: 'left' | 'right',
};

const MIN_WIDTH = 32;

class DocsTableCellResizeHandle extends React.PureComponent {
  _resizeContext = null;
  _eventsCapture = null;

  props: Props;

  componentWillUnmount(): void {
    this._eventsCapture && this._eventsCapture.dispose();
  }

  render(): React.Element<any> {
    const {position} = this.props;

    const className = cx({
      'docs-table-cell-resize-handle': true,
      'docs-table-cell-resize-handle-left': position === 'left',
      'docs-table-cell-resize-handle-right': position === 'right',
    });

    return (
      <div
        className={className}
        data-docs-tool="true"
        onMouseDown={this._onMouseDown}
      />
    );
  }

  _onMouseDown = (e: any): void => {
    if (this._resizeContext) {
      // Already dragging.
      return;
    }
    const {position} = this.props;
    if (position === 'left' || position === 'right') {
      this._blockEvent(e);
      this._onHorizontalResizeStart(e);
    }
  };

  _onHorizontalResizeStart(e: any): void {
    let targetCell = lookupResizeableTableCellElement(asElement(e.target));
    if (!targetCell) {
      return;
    }
    const {position} = this.props;
    if (position === 'left') {
      targetCell = targetCell.previousElementSibling;
      if (!targetCell) {
        return;
      }
    } else {
      // position === 'right'
      if (!targetCell.nextElementSibling) {
        return;
      }
    }

    const td = asElement(targetCell);
    const tr = asElement(td.parentElement);
    const tds =  Array.from(tr.cells || []);
    const table = lookupElementByAttribute(tr, DocsDataAttributes.TABLE);
    const initialStyles = [];
    const initialRects = tds.map((cell: any) => {
      const rect = cell.getBoundingClientRect();
      initialStyles.push(cell.style.cssText);
      return {
        height: rect.height,
        width: rect.width,
        x: rect.x,
        y: rect.y,
      };
    });
    const cellIndex = asNumber(td.cellIndex);
    const newRects = initialRects;
    const minRect = initialRects[cellIndex ];
    const maxRect = initialRects[cellIndex  + 1];
    const minXDelta = minRect ? -Math.max(minRect.width - MIN_WIDTH, 0) : 0;
    const maxXDelta = maxRect ? Math.max(0, maxRect.width - MIN_WIDTH) : 0;

    this._resizeContext = {
      initialRects,
      initialStyles,
      initialX: e.clientX,
      maxXDelta,
      minXDelta,
      moved: false,
      newRects,
      table,
      td,
      tds,
      tr,
    };

    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = captureDocumentEvents({
      mousemove: this._onMouseMove,
      mouseup: this._onMouseUp,
    });
  }

  _onMouseMove = (e: any): void => {
    this._blockEvent(e);
    const resizeContext = this._resizeContext;
    if (!resizeContext) {
      return;
    }
    const {
      initialX, initialRects, td, tds, minXDelta, maxXDelta,
    } = resizeContext;

    let dx = Math.round(e.clientX - initialX);
    dx = Math.min(dx, maxXDelta);
    dx = Math.max(dx, minXDelta);

    let oops = false;
    const currentCell = td;
    const nextCell = tds[td.cellIndex + 1];
    const newRects = initialRects.map((rect: any, ii: number) => {
      const cell = tds[ii];
      if (!cell || !rect) {
        oops = true;
        // DOM changed by others.
        return rect;
      }
      if (cell === currentCell) {
        return {
          ...rect,
          width: rect.width + dx,
        };
      }
      if (cell === nextCell) {
        return {
          ...rect,
          width: rect.width - dx,
        };
      }
      return rect;
    });

    if (oops) {
      return;
    }

    newRects.forEach((rect, ii) => {
      if (initialRects[ii] !== rect) {
        const tdEl = tds[ii];
        const style = tdEl ? tdEl.style : null;
        if (style) {
          style.width = rect.width + 'px';
        }
      }
    });
    resizeContext.moved = true;
    resizeContext.newRects = newRects;
  };

  _onMouseUp = (e: any): void => {
    this._blockEvent(e);
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = null;

    const resizeContext = this._resizeContext;
    this._resizeContext = null;
    if (!resizeContext) {
      return;
    }
    this._resizeContext = null;
    const {newRects, tds, initialStyles, moved} = resizeContext;

    if (!moved) {
      return;
    }

    // Resume styles.
    initialStyles.forEach((style, ii) => {
      const cell = tds[ii];
      if (cell) {
        cell.style.cssText = style;
      }
    });

    const totalWidth = newRects.reduce(
      (sum: number, rect: any) => sum += rect.width,
      0,
    );
    let sum = 0;
    const colWidths = newRects.map((rect: any, ii: number) => {
      // round up to 3 digits decimals.
      let percentage = Math.round(rect.width * 1000 / totalWidth) / 1000;
      sum += percentage;
      if (sum > 1) {
        const bleed = 1 - sum;
        percentage -= bleed;
        sum -= bleed;
      }
      return percentage;
    });
    this.props.onColumnResizeEnd(colWidths);
  };

  _blockEvent(e: any): void {
    e.preventDefault();
    e.stopPropagation();
  }
}

module.exports = DocsTableCellResizeHandle;
