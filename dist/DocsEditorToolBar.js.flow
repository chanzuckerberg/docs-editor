// @flow

import DocsEditorToolBarButton from './DocsEditorToolBarButton';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import withDocsContext from './withDocsContext';
import {ButtonGroup} from 'react-bootstrap';
import {EditorState} from 'draft-js';
import {UNORDERED_LIST, ORDERED_LIST, BLOCK_QUOTE, H1, H2, H3, H4, LINK, BOLD, ITALIC, UNDERLINE, STRIKE, CODE, HIGHLIGHT, IMAGE, TABLE, MATH, EXPANDABLE, UNDO, REDO} from './DocsEditorToolBarFeatures';

import type {DocsEditorLike} from './Types';
import type {EditorToolbarFeature} from './DocsEditorToolBarFeatures';

import './DocsEditorToolBar.css';

type Props = {
  editorState: EditorState,
  getEditor: () => ?DocsEditorLike,
  onChange: (e: EditorState) => void,
};

class DocsEditorToolBar extends React.PureComponent {
  state = {
    focusedEditorState: null,
  };

  props: Props;

  _eventsCapture = null;
  _timer = new Timer();
  _modalHandle = null;

  componentDidMount(): void {
    // Need to observe Selection change.
    // TODO: Build Selection observer.
    this._eventsCapture = captureDocumentEvents({
      mousedown: this._maybeWillRerender,
      mouseup: this._maybeWillRerender,
    });
  }

  componentWillUnmount(): void {
    this._timer.dispose();
    this._eventsCapture && this._eventsCapture.dispose();
    this._closeModal();
  }

  render(): ?React.Element<any> {
    const {docsContext} = this.context;
    const {canEdit, allowedActions} = docsContext;
    if (!canEdit) {
      return null;
    }
    const {editorState, onChange} = this.props;
    return (
      <div className="docs-editor-toolbar" data-docs-tool="true">
        <div className="docs-editor-toolbar-body">
          <ButtonGroup className="docs-buttons-group" key="block">
            {
              [
                UNORDERED_LIST,
                ORDERED_LIST,
                BLOCK_QUOTE,
                H1,
                H2,
                H3,
                H4,
              ].map(this._renderButton)
            }
          </ButtonGroup>
          <ButtonGroup className="docs-buttons-group" key="inline">
            {
              [
                LINK,
                BOLD,
                ITALIC,
                UNDERLINE,
                STRIKE,
                CODE,
                HIGHLIGHT,
              ].map(this._renderButton)
            }
          </ButtonGroup>
          <ButtonGroup className="docs-buttons-group" key="insert">
          {
            [
              IMAGE,
              TABLE,
              MATH,
              EXPANDABLE,
            ].map(this._renderButton)
          }
          </ButtonGroup>
          <ButtonGroup className="docs-buttons-group" key="history">
            <DocsEditorToolBarButton
              active={false}
              disabled={!UNDO.isEnabled(UNDO, editorState)}
              feature={UNDO}
              onClick={this._onHistoryButtonClick}
            />
            <DocsEditorToolBarButton
              active={false}
              disabled={!REDO.isEnabled(REDO, editorState)}
              feature={REDO}
              onClick={this._onHistoryButtonClick}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  }

  _renderButton = (feature: EditorToolbarFeature): ?React.Element<any> => {
    const {allowedActions} = this.context.docsContext;
    if (!allowedActions.has(feature.action)) {
      return null;
    }
    const disabled = false;
    const active = false;
    // active={editorState ? feature.isActive(feature, editorState) : false}
    // disabled={editorState ? !feature.isEnabled(feature, editorState) : true}
    return (
      <DocsEditorToolBarButton
        disabled={disabled}
        active={active}
        feature={feature}
        key={feature.action}
        onClick={this._onButtonClick}
      />
    );
  };

  _maybeWillRerender = (): void => {
    this._timer.clear();
    this._timer.set(this._maybyRerender, 150);
  };

  _maybyRerender = (): void => {
    // If editorState changed, force re-render.
    const editor = this.props.getEditor();
    if (editor) {
      const {editorState, onChange} = editor.props;
      if (editorState !== this.state.focusedEditorState) {
        this.setState({
          focusedEditorState: editorState,
        });
      }
    }
  };

  _onHistoryButtonClick = (feature: EditorToolbarFeature): void => {
    const {docsContext} = this.context;
    const {editorState, onChange} = this.props;
    feature.update(
      feature,
      editorState,
      (nextEditorState) => {
        if (nextEditorState && nextEditorState !== editorState) {
          onChange(nextEditorState);
        }
      },
      docsContext,
    );
  };

  _onButtonClick = (feature: EditorToolbarFeature): void => {
    this._closeModal();

    const editor: any = this.props.getEditor() || {props: {}};

    const {editorState, onChange} = (feature === REDO || feature === UNDO) ?
      this.props :
      editor.props;

    if (!onChange  || !editorState) {
      return;
    }

    const {docsContext} = this.context;

    this._modalHandle = feature.update(
      feature,
      editorState,
      onChange,
      docsContext,
    );
  };

  _closeModal(): void {
    this._modalHandle && this._modalHandle.dispose();
    this._modalHandle = null;
  }
}

module.exports = withDocsContext(DocsEditorToolBar);
