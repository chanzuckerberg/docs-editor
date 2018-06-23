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
  const script = createElement('script', {
    id: id + 'script',
    crossorigin: 'anonymous',
    integrity: 'sha384-GR8SEkOO1rBN/jnOcQDFcFmwXAevSLx7/Io9Ps1rkxWp983ZIuUGfxivlF/5f5eJ',
    src: '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0-alpha1/katex.min.js',
  });
  const style = createElement('link', {
    id: id + 'style',
    crossorigin: 'anonymous',
    href: '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0-alpha1/katex.min.css',
    integrity: 'sha384-8QOKbPtTFvh/lMY0qPVbXj9hDh+v8US0pD//FcoYFst2lCIf0BmT58+Heqj0IGyx',
    rel: 'stylesheet',
  });
  return Promise.all([
    loadResource(script),
    loadResource(style),
  ]);
}


let _instance = null;

function getInstance(): DocsKatexResourcesLoader {
  if (!_instance) {
    _instance = new DocsKatexResourcesLoader;
  }
  return _instance;
}

class DocsKatexResourcesLoader {

  static getInstance = getInstance;

  _id = uniqueID();
  _loaded = false;
  _loading = false;
  _callbacks = [];

  isReady(): boolean {
    return this._loaded;
  }

  load(): void {
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

module.exports = DocsKatexResourcesLoader;
