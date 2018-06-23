
// @flow

import ResizeObserver from 'resize-observer-polyfill';

import nullthrows from 'nullthrows';

// flow type copied from https://github.com/que-etc/resize-observer-polyfill/blob/master/src/index.js.flow

type DOMRectReadOnly = {
  +x: number,
  +y: number,
  +width: number,
  +height: number,
  +top: number,
  +right: number,
  +bottom: number,
  +left: number,
};

type ResizeCallback = (r: ResizeObserverEntry) => void;

type Entries = $ReadOnlyArray<ResizeObserverEntry>;

export type ResizeObserverEntry = {
  +target: Element,
  +contentRect: DOMRectReadOnly,
};

let instance: ?ResizeObserver = null;

const nodesObserving: Map<Element, Array<ResizeCallback>> = new Map();

function onResizeObserve(entries: Entries): void {
  entries.forEach(handleResizeObserverEntry);
}

function handleResizeObserverEntry(entry: ResizeObserverEntry): void {
  const node = entry.target;
  const callbacks = nodesObserving.get(node);
  const executeCallback = (cb) => cb(entry);
  callbacks && callbacks.forEach(executeCallback);
}

function observe(node: Element, callback: (ResizeObserverEntry) => void): void {
  const observer = instance || (instance = new ResizeObserver(onResizeObserve));
  if (nodesObserving.has(node)) {
    // Already observing node.
    const callbacks = nullthrows(nodesObserving.get(node));
    callbacks.push(callback);
  } else {
    const callbacks = [callback];
    nodesObserving.set(node, callbacks);
    observer.observe(node);
  }
}

function unobserve(node: Element, callback?: ResizeCallback): void {
  const observer = instance;
  if (!observer) {
    return;
  }

  observer.unobserve(node);

  if (callback) {
    // Remove the passed in callback from the callbacks of the observed node
    // And, if no more callbacks then stop observing the node
    const callbacks = nodesObserving.has(node)  ?
      nullthrows(nodesObserving.get(node)).filter(cb => cb !== callback) :
      null;
    if (callbacks && callbacks.length) {
      nodesObserving.set(node, callbacks);
    } else {
      nodesObserving.delete(node);
    }
  } else {
    // Delete all callbacks for the node.
    nodesObserving.delete(node);
  }

  if (!nodesObserving.size) {
    // We have nothing to observe. Stop observing, which stops the
    // ResizeObserver instance from receiving notifications of
    // DOM resizing. Until the observe() method is used again.
    // According to specification a ResizeObserver is deleted by the garbage
    // collector if the target element is deleted.
    observer.disconnect();
    instance = null;
  }
}

// Lightweight utilities to make observing resize of DOM element easier
// with `ResizeObserver`.
// See https://developers.google.com/web/updates/2016/10/resizeobserver
// Usage:
//   `ResizeObserver.observe(element, (entry) => console.log(entry))`
//   `ResizeObserver.unobserve(element)`
module.exports = {
  observe,
  unobserve,
};
