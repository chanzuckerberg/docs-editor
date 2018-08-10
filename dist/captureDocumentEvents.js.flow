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
): Disposable {
  let doc: any = document;
  let callbacks: any = handlers;
  if (doc && callbacks) {
    Object.keys(callbacks).forEach(type => {
      doc.addEventListener(type, handlers[type], true);
    });
  }
  return {
    dispose() {
      if (doc && callbacks) {
        Object.keys(callbacks).forEach(type => {
          doc.removeEventListener(type, handlers[type], true);
        });
        callbacks = null;
        doc = null;
      }
    },
  };
}

module.exports = captureDocumentEvents;
