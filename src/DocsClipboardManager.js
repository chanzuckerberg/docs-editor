// @flow

import DataTransfer from 'fbjs/lib/DataTransfer';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import nullthrows from 'nullthrows';

class DocsClipboardManager {
  _pasteData = null;
  _timer = new Timer();

  constructor() {
    // TODO: Dispose the events capture.
    captureDocumentEvents({
      copy: this._clearPasteData,
      paste: this._onPaste,
    });
  }

  getClipboardData(): ?DataTransfer {
    return this._pasteData;
  }

  _onPaste = (e: any): void => {
    this._timer.clear();
    this._pasteData = new DataTransfer(nullthrows(e.clipboardData));
    // Only keep the paste data for 150ms.
    this._timer.set(this._clearPasteData, 150);
  };

  _clearPasteData = (): void => {
    this._pasteData= null;
  }
}

module.exports = DocsClipboardManager;
