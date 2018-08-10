// @flow

import nullthrows from 'nullthrows';

class Timer {
  _aIDs = new Set();
  _tIDs = new Set();
  _disposed = false;

  set(fn: Function, delay: ?number): void {
    if (this._disposed) {
      return;
    }

    if (!delay || delay <= 16) {
      let ids = this._aIDs;
      let id = window.requestAnimationFrame(() => {
        nullthrows(ids).delete(nullthrows(id));
        ids = null;
        id = null;
        fn();
      });
      ids.add(id);
    } else {
      let ids = this._tIDs;
      let id = window.setTimeout(() => {
        nullthrows(ids).delete(nullthrows(id));
        ids = null;
        id = null;
        fn();
      }, delay);
      ids.add(id);
    }
  }

  /**
   * Cancel all scheduled function calls in queue.
   *
   * NOTE: The timer still honor any function calls scheduled after a clear
   */
  clear(): void {
    this._aIDs.forEach(id => {
      window.cancelAnimationFrame(id);
    });
    this._tIDs.forEach(id => {
      window.clearTimeout(id);
    });
    this._aIDs.clear();
    this._tIDs.clear();
  }

  /**
   * Clear the queue & stop honoring any future requests.
   *
   * This method is convenient to call in `componentWillUnmount` to make
   * sure your timer doesn't trigger any new function call.
   */
  dispose(): void {
    this._disposed = true;
    this.clear();
  }
}

module.exports = Timer;
