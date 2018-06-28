// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsEventTypes from './DocsEventTypes';
import DocsResourcesLoader from './DocsResourcesLoader';
import DocsMathEditor from './DocsMathEditor';
import React from 'react';
import cx from 'classnames';
import docsWithContext from './docsWithContext';
import showModalDialog from './lib/showModalDialog';
import {renderLatexAsHTML} from './DocsHelpers';
import {setMathValue} from './MathModifiers';
import {uniqueID} from './DocsHelpers';

import './DocsMath.css';

import type {MathEntityData} from './Types';
import type {ModalHandle} from './lib/showModalDialog';

type Props = {
  entityData: MathEntityData,
  onEntityDataChange: (o: ?MathEntityData) => void,
};

function showMathEditorModalDialog(
  entityData: MathEntityData,
  callback: Function,
): ModalHandle {
  return showModalDialog(
    DocsMathEditor, {
    title: 'Edit Math',
    entityData,
  }, callback);
}

DocsResourcesLoader.init();

class DocsMath extends React.PureComponent {

  props: Props;

  _id = uniqueID();
  _mathEditorModal = null;

  state = {
    editing: false,
    ready: DocsResourcesLoader.isReady(),
  };

  componentWillMount(): void {
    DocsResourcesLoader.on(DocsEventTypes.LOAD, this._onKatexLoad);
  }

  componentWillUnmount(): void {
    this._mathEditorModal && this._mathEditorModal.dispose();
    DocsResourcesLoader.off(DocsEventTypes.LOAD, this._onKatexLoad);
  }

  render(): React.Element<any> {
    const {canEdit} = this.context.docsContext;
    const {editing, ready} = this.state;
    const {entityData} = this.props;
    const {latex} = entityData;
    const className = cx({
      'docs-math': true,
      'docs-math-editing': editing,
    });

    const attrs = {
      [DocsDataAttributes.WIDGET]: true,
    };
    const content = ready ?
      <span dangerouslySetInnerHTML={{__html: renderLatexAsHTML(latex || '')}} /> :
      <span>...</span>;
    return (
      <span
        {...attrs}
        className={className}
        contentEditable={false}
        onClick={canEdit ? this._onClick : null}>
        {content}
      </span>
    );
  }

  _onMathValueSet = (value: ?MathEntityData): void => {
    this.setState({editing: false});
    if (!value) {
      // cancelled.
      return;
    }
    const {entityData, onEntityDataChange} = this.props;
    onEntityDataChange(setMathValue(entityData, value));
  };

  _onKatexLoad = (): void => {
    this.setState({ready: true});
  };

  _onClick = (e: any) => {
    e.preventDefault();
    this.setState({editing: true});
    const {entityData} = this.props;
    this._mathEditorModal =
      showMathEditorModalDialog(entityData, this._onMathValueSet);
  }
}

module.exports = docsWithContext(DocsMath);
