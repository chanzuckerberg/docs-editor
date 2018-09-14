// @flow

import AbstractBehavior from './AbstractBehavior';
import DocsActionTypes from './DocsActionTypes';
import returnTrue from './returnTrue';
import returnFalse from './returnFalse';

import DocsContext from './DocsContext';
import {EditorState} from 'draft-js';

import type {ModalHandle} from './showModalDialog';
import type {OnChange} from './AbstractBehavior';

class CalculatorBehavior extends AbstractBehavior {
  constructor() {
    super({
      action: DocsActionTypes.CALCULATOR_INSERT,
      icon: 'keyboard',
      label: 'Insert Calculator',
    });
  }

  execute = (e: EditorState, o: OnChange, d: DocsContext): ?ModalHandle => {
    console.log('not supported');
  };
}

export default CalculatorBehavior;
