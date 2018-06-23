// @flow

import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';
import nullthrows from 'nullthrows';

function main(): void {
  const el = document.createElement('div');
  el.id = 'demo-app';
  nullthrows(document.body).appendChild(el);
  ReactDOM.render(<App />, el);
}

window.onload = main;
