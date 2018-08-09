// @flow

import React from 'react';
import renderLatexAsHTML from './renderLatexAsHTML';

class DocsMathEditorGuide extends React.PureComponent {
  props: {
    symbolsGuide: Object,
  };

  render(): React.Element<any> {
   return (
      <div className="docs-math-editor-guide-table-container">
        <div>
          Start typing the name of a mathematical function to automatically
          insert it. (For example, "sqrt" for root, "mat" for matrix, or "defi"
          for definite integral.)
        </div>
        {this._renderSymbolsGuide()}
        {this._renderControlsGuide()}
      </div>
    );
  }

  _renderControlsGuide(): React.Element<any> {
    const lines = {
      'left/right arrows': 'Move cursor',
      'shift+left/right arrows': 'Select region',
      'ctrl+a': 'Select all',
      'ctrl+x/c/v': 'Cut/copy/paste',
      'ctrl+z/y': 'Undo/redo',
      'ctrl+left/right': 'Add entry to list or column to matrix',
      'shift+ctrl+left/right': 'Add copy of current entry/column to to list/matrix',
      'ctrl+up/down': 'Add row to matrix',
      'shift+ctrl+up/down': 'Add copy of current row to matrix',
      'ctrl+backspace': 'Delete current entry in list or column in matrix',
      'ctrl+shift+backspace': 'Delete current row in matrix',
    };
    const rows = Object.keys(lines).sort().reduce((memo, key) => {
      memo.push(
        <tr key={`row-control-${key}`}>
          <th className="docs-math-editor-guide-th">
            {key}
          </th>
          <td className="docs-math-editor-guide-td">
            {lines[key]}
          </td>
        </tr>
      );
      return memo;
    }, []);

    return (
      <table className="docs-math-editor-guide-table">
        <caption>Controls</caption>
        <thead>
          <tr key="first">
            <th className="docs-math-editor-guide-th">Press...</th>
            <th className="docs-math-editor-guide-th">...to do</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  _renderSymbolsGuide(): React.Element<any> {
    const {symbolsGuide} = this.props;
    const rows = Object.keys(symbolsGuide).sort().reduce((memo, key) => {
      const html = renderLatexAsHTML(String(symbolsGuide[key]));
      memo.push(
        <tr key={`row-symbol-${key}`}>
          <th className="docs-math-editor-guide-th">
            {key}
          </th>
          <td className="docs-math-editor-guide-td">
            <div dangerouslySetInnerHTML={{__html: html}} />
          </td>
        </tr>
      );
      return memo;
    }, []);

    return (
      <section>
        <table className="docs-math-editor-guide-table">
          <caption>Symbols</caption>
          <thead>
            <tr key="first">
              <th className="docs-math-editor-guide-th">Type...</th>
              <th className="docs-math-editor-guide-th">...to get</th>
            </tr>
          </thead>
          <tbody>

            {rows}
          </tbody>
        </table>
      </section>
    );
  }
}

export default DocsMathEditorGuide;
