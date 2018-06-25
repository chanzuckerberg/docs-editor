// @flow

import {asElement, tryWarn} from './DocsHelpers';
import {uniqueID} from './DocsHelpers';

function createElement(tag: string, attrs: Object): Element {
  const el = document.createElement(tag);
  Object.keys(attrs).forEach(key => {
    el.setAttribute(key, attrs[key]);
  });
  return el;
}

function cleanElementHandlers(element: Element): void {
  const node: any = element;
  node.onload = null;
  node.onerror = null;
}

function injectElement(
  element: Element,
  onLoad: Function
): void {
  const oldEl = element.id ? document.getElementById(element.id) : null;
  if (oldEl) {
    cleanElementHandlers(asElement(oldEl));
    oldEl.parentNode && oldEl.parentNode.removeChild(oldEl);
  }
  const node: any = element;
  node.onload = () => {
    cleanElementHandlers(element);
    onLoad();
  };
  node.onerror = () => {
    cleanElementHandlers(element);
    // re-try.
    const retry = injectElement.bind(null, element.cloneNode(true), onLoad);
    tryWarn('Failed to load resource for <' + element.id + '>, will try again');
    setTimeout(retry, 1000);
  };
  const head = asElement(document.head || document.body);
  head.appendChild(element);
}

function loadResource(element: Element): Promise<any> {
  return new Promise(resolve => {
    injectElement(element, resolve);
  });
}

function loadResources(id: string): Promise<any> {

  const styles = [
    createElement('link', {
      id: id + '-katex-style',
      crossorigin: 'anonymous',
      href: '//cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.css',
      integrity: 'sha384-9tPv11A+glH/on/wEu99NVwDPwkMQESOocs/ZGXPoIiLE8MU/qkqUcZ3zzL+6DuH',
      rel: 'stylesheet',
    }),
    createElement('link', {
      id: id + '-materialicons-style',
      crossorigin: 'anonymous',
      href: '//fonts.googleapis.com/icon?family=Material+Icons',
      rel: 'stylesheet',
    }),
  ];

  return Promise.all(styles.map(loadResource));
}

class DocsResourcesLoader {
  _callbacks = [];
  _id = uniqueID();
  _initialized = false;
  _loaded = false;
  _loading = false;

  isReady(): boolean {
    return this._loaded;
  }

  init(): void {
    if (this._loaded || this._loading) {
      return;
    }
    this._loading = true;
    loadResources(this._id).then(this._onLoad);
  }

  on(type: string, callback: Function): void {
    this._callbacks.push([type, callback]);
  }

  off(type: string, callback: Function): void {
    this._callbacks = this._callbacks.filter(spec => {
      const [specType, specCallback] = spec;
      return !(specType === type && specCallback === callback);
    });
  }

  _onLoad = (): void => {
    this._loaded = true;
    this._loading = false;
    this._callbacks.forEach(spec => {
      const fn = spec[1];
      fn && fn();
    });
  };
}

module.exports = new DocsResourcesLoader();
module.exports = new DocsResourcesLoader();
