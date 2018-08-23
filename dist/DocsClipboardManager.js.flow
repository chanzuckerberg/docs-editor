// @flow

import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import nullthrows from 'nullthrows';
import DataTransfer from 'fbjs/lib/DataTransfer';

type ClipboardData = {
  isRichText: () => boolean,
};

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

  getClipboardData(): ?ClipboardData {
    const dt: any = this._pasteData;
    return dt;
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
