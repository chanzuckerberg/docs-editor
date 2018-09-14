// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsEventTypes from './DocsEventTypes';
import DocsResourcesLoader from './DocsResourcesLoader';
import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import uniqueID from './uniqueID';
import withDocsContext from './withDocsContext';
import {ContentBlock, EditorState, Entity} from 'draft-js';

import './DocsCalculator.css';

DocsResourcesLoader.init();

class DocsCalculator extends React.PureComponent {

  _id = uniqueID();

  state = {
    editing: false,
    ready: DocsResourcesLoader.isReady(),
  };

  componentWillUnmount(): void {
    DocsResourcesLoader.off(DocsEventTypes.LOAD, this._onDesmosLoad);
  }

  componentDidMount(): void {
    if (window.Desmos) {
      this._onDesmosLoad();
    } else {
      DocsResourcesLoader.on(DocsEventTypes.LOAD, this._onDesmosLoad);
    }
  }

  render(): React.Element<any> {


    const attrs = {
      [DocsDataAttributes.WIDGET]: true,
    };

    return (
      <div
        {...attrs}
        className="docs-calculator"
        contentEditable={false}
        onInput={this._maskEvent}
        onKeyDown={this._maskEvent}
        onKeyPress={this._maskEvent}
        onKeyUp={this._maskEvent}
        tabIndex={0}>
        <div id={this._id} />
      </div>
    )
  }

  _maskEvent = (e: SyntheticEvent): void => {
    e.stopPropagation();
  };

  _onDesmosLoad = (): void => {
    const Desmos: any = window.Desmos;
    if (!Desmos) {
      return;
    }

    const el = document.getElementById(this._id);
    if (!el) {
      return;
    }
    el.innerHTML = '';
    Desmos.FourFunctionCalculator(el);
    // Desmos.GraphingCalculator(el);
    // case CALCULATOR_ALLOWED.SCIENTIFIC:
    //   Desmos.ScientificCalculator(this.refs.calculator);
    //   break;
    // case CALCULATOR_ALLOWED.FOUR_FUNCTION:
    //   Desmos.FourFunctionCalculator(this.refs.calculator);
    //   break;
    // case CALCULATOR_ALLOWED.GRAPHING:
    //   Desmos.GraphingCalculator(this.refs.calculator);
    //   break;
  };
}

export default withDocsContext(DocsCalculator);
