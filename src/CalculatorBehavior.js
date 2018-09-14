// @flow

import AbstractBehavior from './AbstractBehavior';
import DocsActionTypes from './DocsActionTypes';
import DocsBlockTypes from './DocsBlockTypes';
import DocsContext from './DocsContext';
import hasNoSelection from './hasNoSelection';
import returnFalse from './returnFalse';
import returnTrue from './returnTrue';
import {EditorState} from 'draft-js';
import {insertCustomBlock} from './DocsModifiers';

import type {ModalHandle} from './showModalDialog';
import type {OnChange} from './AbstractBehavior';

// case CALCULATOR_ALLOWED.SCIENTIFIC:
//         window.Desmos.ScientificCalculator(this.refs.calculator);
//         break;
//       case CALCULATOR_ALLOWED.FOUR_FUNCTION:
//         window.Desmos.FourFunctionCalculator(this.refs.calculator);
//         break;
//       case CALCULATOR_ALLOWED.GRAPHING:
//         window.Desmos.GraphingCalculator(this.refs.calculator);

function insertCalculator(editorState: EditorState): EditorState {
  return insertCustomBlock(
    editorState,
    DocsBlockTypes.DOCS_CALCULATOR,
    {
      calculatorType: '',
    },
  );
}

class CalculatorBehavior extends AbstractBehavior {
  constructor() {
    super({
      action: DocsActionTypes.CALCULATOR_INSERT,
      icon: 'keyboard',
      label: 'Insert Calculator',
    });
  }

  isEnabled = (e: EditorState): boolean => {
    return hasNoSelection(e);
  }

  execute = (editorState: EditorState, onChange: OnChange, d: DocsContext): ?ModalHandle => {
    onChange(insertCalculator(editorState));
    return null;
  };
}

export default CalculatorBehavior;
