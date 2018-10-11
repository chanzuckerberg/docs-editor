'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createElement(tag, attrs) {
  var el = document.createElement(tag);
  (0, _keys2.default)(attrs).forEach(function (key) {
    if (key === 'className') {
      el[key] = attrs[key];
    } else {
      el.setAttribute(key, attrs[key]);
    }
  });
  return el;
}

function cleanElementHandlers(element) {
  var node = element;
  node.onload = null;
  node.onerror = null;
}

function injectElement(element, onLoad) {
  var oldEl = element.id ? document.getElementById(element.id) : null;
  if (oldEl) {
    cleanElementHandlers(oldEl);
    oldEl.parentElement && oldEl.parentElement.removeChild(oldEl);
  }
  var node = element;
  node.onload = function () {
    cleanElementHandlers(element);
    onLoad();
  };
  node.onerror = function () {
    cleanElementHandlers(element);
    // re-try.
    var retry = injectElement.bind(null, element.cloneNode(true), onLoad);
    (0, _warn2.default)('Failed to load resource for <' + element.id + '>, will try again');
    setTimeout(retry, 1000);
  };
  var head = (0, _nullthrows2.default)(document.head || document.body);
  head.appendChild(element);
}

function loadResource(element) {
  return new _promise2.default(function (resolve) {
    injectElement(element, resolve);
  });
}

function isUsingMaterialIcon() {
  var el = createElement('font', { className: 'material-icons' });
  el.style.cssText = 'position:absolute;top:0;left:0;';
  if (document.body) {
    (0, _nullthrows2.default)(document.body).appendChild(el);
  } else {
    var root = (0, _nullthrows2.default)(document.documentElement);
    root.insertBefore(el, root.firstChild);
  }
  var result = /material/ig.test(window.getComputedStyle(el).fontFamily);
  (0, _nullthrows2.default)(el.parentElement).removeChild(el);
  return result;
}

function loadResources(id) {

  var resources = [createElement('link', {
    id: id + '-katex-style',
    crossorigin: 'anonymous',
    href: 'https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.css',
    integrity: 'sha384-9tPv11A+glH/on/wEu99NVwDPwkMQESOocs/ZGXPoIiLE8MU/qkqUcZ3zzL+6DuH',
    rel: 'stylesheet'
  })];
  if (!isUsingMaterialIcon()) {
    resources.push(createElement('link', {
      id: id + '-materialicons-style',
      crossorigin: 'anonymous',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      rel: 'stylesheet'
    }));
  }

  if (/(localhost|hedger|dev)/.test(window.location.href)) {
    // TODO:
    // This is not production ready, must have an reliable way to detect this.
    resources.push(createElement('script', {
      id: id + '-calculator-js',
      src: 'https://cdn.summitlearning.org/assets/javascripts/calculator1.0.js',
      async: 'true',
      defer: 'defer'
    }));
  }

  return _promise2.default.all(resources.map(loadResource));
}

var DocsResourcesLoader = function () {
  function DocsResourcesLoader() {
    var _this = this;

    (0, _classCallCheck3.default)(this, DocsResourcesLoader);
    this._callbacks = [];
    this._id = (0, _uniqueID2.default)();
    this._initialized = false;
    this._loaded = false;
    this._loading = false;

    this._onLoad = function () {
      _this._loaded = true;
      _this._loading = false;
      _this._callbacks.forEach(function (spec) {
        var fn = spec[1];
        fn && fn();
      });
    };
  }

  (0, _createClass3.default)(DocsResourcesLoader, [{
    key: 'isReady',
    value: function isReady() {
      return this._loaded;
    }
  }, {
    key: 'init',
    value: function init() {
      if (this._loaded || this._loading) {
        return;
      }
      this._loading = true;
      loadResources(this._id).then(this._onLoad);
    }
  }, {
    key: 'on',
    value: function on(type, callback) {
      this._callbacks.push([type, callback]);
    }
  }, {
    key: 'off',
    value: function off(type, callback) {
      this._callbacks = this._callbacks.filter(function (spec) {
        var _spec = (0, _slicedToArray3.default)(spec, 2),
            specType = _spec[0],
            specCallback = _spec[1];

        return !(specType === type && specCallback === callback);
      });
    }
  }]);
  return DocsResourcesLoader;
}();

module.exports = new DocsResourcesLoader();