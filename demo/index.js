// flow

import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';

function main(): void {
  const el = document.createElement('div');
  el.id = 'demo-app';
  document.body.appendChild(el);
  ReactDOM.render(<App />, el);
}

window.onload = main;
