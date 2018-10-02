// @flow

type DOMEventHandler = (e: Event) => void;

type Disposable = {
  dispose: () => void,
};

type DOMEventHandlers = {
  mouseup?: ?DOMEventHandler,
  click?: ?DOMEventHandler,
  mousemove?: ?DOMEventHandler,
};

function captureDocumentEvents(
  handlers: DOMEventHandlers,
  useBubble?: ?boolean,
): Disposable {
  let doc: any = document;
  let callbacks: any = handlers;
  if (doc && callbacks) {
    Object.keys(callbacks).forEach(type => {
      doc.addEventListener(type, handlers[type], !useBubble);
    });
  }
  return {
    dispose() {
      if (doc && callbacks) {
        Object.keys(callbacks).forEach(type => {
          doc.removeEventListener(type, handlers[type], !useBubble);
        });
        callbacks = null;
        doc = null;
      }
    },
  };
}

module.exports = captureDocumentEvents;
