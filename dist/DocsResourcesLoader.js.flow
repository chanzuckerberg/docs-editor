// @flow

import nullthrows from 'nullthrows';
import uniqueID from './uniqueID';
import warn from './warn';

function createElement(tag: string, attrs: Object): Element {
  const el:any = document.createElement(tag);
  Object.keys(attrs).forEach(key => {
    if (key === 'className') {
      el[key] = attrs[key];
    } else {
      el.setAttribute(key, attrs[key]);
    }
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
  let retryCount = 0;
  let retryDelay = 0;
  const oldEl = element.id ? document.getElementById(element.id) : null;
 
  if (oldEl) {
    cleanElementHandlers(oldEl);
    oldEl.parentElement && oldEl.parentElement.removeChild(oldEl);
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
    warn('Failed to load resource for <' + element.id + '>, will try again');
    retryDelay += 1000;
    retryCount += 1;
    if (retryCount < 10) {
      setTimeout(retry, retryDelay);
    }
  };
  const head = nullthrows(document.head || document.body);
  head.appendChild(element);
}

function loadResource(element: Element): Promise<any> {
  return new Promise(resolve => {
    injectElement(element, resolve);
  });
}

function isUsingMaterialIcon() {
  const el:any = createElement('font', {className: 'material-icons'});
  el.style.cssText = 'position:absolute;top:0;left:0;';
  if (document.body) {
    nullthrows(document.body).appendChild(el);
  } else {
    const root = nullthrows(document.documentElement);
    root.insertBefore(el, root.firstChild);
  }
  const result = /material/ig.test(window.getComputedStyle(el).fontFamily);
  nullthrows(el.parentElement).removeChild(el);
  return result;
}

function loadResources(id: string): Promise<any> {

  const resources = [
    createElement('link', {
      id: id + '-katex-style',
      crossorigin: 'anonymous',
      href: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css',
      rel: 'stylesheet',
    }),
  ];
  if (!isUsingMaterialIcon()) {
    resources.push(
      createElement('link', {
        id: id + '-materialicons-style',
        crossorigin: 'anonymous',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        rel: 'stylesheet',
      }),
    )
  }

  if (/localhost/.test(window.location.href)) {
    // TODO:
    // This is not production ready, must have an reliable way to detect this.
    resources.push(
      createElement('script', {
        id: id + '-calculator-js',
        src: 'https://cdn.summitlearning.org/assets/javascripts/calculator1.0.js',
        async: 'true',
        defer: 'defer',
      }),
    );
  }

  return Promise.all(resources.map(loadResource));
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
