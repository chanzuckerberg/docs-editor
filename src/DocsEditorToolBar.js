// @flow

import DocsActionTypes from './DocsActionTypes';
import DocsContext from './DocsContext';
import DocsEditorToolBarButton from './DocsEditorToolBarButton';
import DocsImageEditor from './DocsImageEditor';
import DocsMathEditor from './DocsMathEditor';
import DocsTextInputEditor from './DocsTextInputEditor';
import React from 'react';
import Timer from './Timer';
import captureDocumentEvents from 'v2/core/util/captureDocumentEvents';
import docsWithContext from './docsWithContext';
import httpAutoPrefixer from 'v2/core/util/httpAutoPrefixer';
import showModalDialog from 'v2/core/util/showModalDialog';
import {ButtonGroup} from 'react-bootstrap';
import {EditorState} from './DraftJS';
import {getCurrentSelectionEntity} from './DocsHelpers';
import {getEditCapability, maybeUpdateAnnotation, maybeInsertBlock, maybeFormatInlineText, maybeUpdateHistory, maybeFormatBlockText, ANNOTATION_SPECS, INSERT_SPECS, INLINE_SPECS, BLOCK_SPECS, HISTORY_SPECS} from './DocsEditorToolBarHelpers';
import {updateLink, updateEntityData} from './DocsModifiers';

import type {BaseEditor} from './Types';
import type {Spec} from './DocsEditorToolBarButton';
import type {ModalHandle} from 'v2/core/util/showModalDialog';

type Props = {
  getEditor: () => ?BaseEditor,
};

function showLinkEditorModalDialog(url: ?string, callback: Function): ModalHandle {
  return showModalDialog(DocsTextInputEditor, {
    title: 'Enter link URL or leave it empty to remove the link',
    value: url,
  }, callback);
}

// This opens an image editor for the image that was just inserted by user.
function showImageEditorModalDialog(
  docsContext: DocsContext,
  editorState: EditorState,
  onChange: (e: EditorState) => void,
): ModalHandle {
  const contentState = editorState.getCurrentContent();
  const entityKey = contentState.getLastCreatedEntityKey();
  const entity = contentState.getEntity(entityKey);
  const entityData = entity.getData();
  return showModalDialog(
    DocsImageEditor,
    {
      docsContext,
      entityData,
      title: 'Edit Image',
    },
    (newEntityData) => {
      if (newEntityData) {
        const newEditorState = updateEntityData(
          editorState,
          entityKey,
          newEntityData,
        );
        onChange(newEditorState);
      }
    },
  );
}

// This opens an math editor for the math placeholder that was just inserted by
// user.
function showMathEditorModalDialog(
  docsContext: DocsContext,
  editorState: EditorState,
  onChange: (e: EditorState) => void,
): ModalHandle {
  const contentState = editorState.getCurrentContent();
  const entityKey = contentState.getLastCreatedEntityKey();
  const entity = contentState.getEntity(entityKey);
  const entityData = entity.getData();
  return showModalDialog(
    DocsMathEditor,
    {
      docsContext,
      entityData,
    },
    (newEntityData) => {
      if (newEntityData) {
        const newEditorState = updateEntityData(
          editorState,
          entityKey,
          newEntityData,
        );
        onChange(newEditorState);
      }
    },
  );
}


function updateEditorLink(editor: BaseEditor, url: ?string): void {
  if (url === undefined) {
    return;
  }
  url = url ? httpAutoPrefixer(url) : null;
  const {editorState, onChange} = editor.props;
  const newEditorState = updateLink(editorState, url);
  if (newEditorState && newEditorState !== editorState) {
    onChange(newEditorState);
  }
}

class DocsEditorToolBar extends React.PureComponent {

  _editCapability = getEditCapability(null);
  _eventsCapture = null;
  _imageEditorModal = null;
  _linkEditorModal = null;
  _mathEditorModal = null;
  _timer = new Timer();
  _timerID = 0;

  state = {
    editorState: null,
  };

  props: Props;

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
    this._imageEditorModal && this._imageEditorModal.dispose();
    this._linkEditorModal && this._linkEditorModal.dispose();
    this._eventsCapture && this._eventsCapture.dispose();
  }

  render(): ?React.Element<any> {
    const {docsContext} = this.context;
    const {canEdit, allowedActions} = docsContext;
    if (!canEdit) {
      return null;
    }

    const editor = this.props.getEditor();
    this._editCapability = getEditCapability(editor);
    const specFilter = (({action}) => allowedActions.has(action));
    const insertButtons =
      INSERT_SPECS.filter(specFilter).map(this._renderInsertButton);
    const inlineButtons =
      INLINE_SPECS.filter(specFilter).map(this._renderInlineStyleButton);
    const blockButtons =
      BLOCK_SPECS.filter(specFilter).map(this._renderBlockStyleButton);
    const historyButtons =
      HISTORY_SPECS.filter(specFilter).map(this._renderHistoryButton);
    const annotationButtons =
      ANNOTATION_SPECS.filter(specFilter).map(this._renderAnnotationButton);
    return (
      <div className="docs-editor-toolbar" data-docs-tool="true">
        <div className="docs-editor-toolbar-body">
          <ButtonGroup className="docs-buttons-group" key="block">
            {blockButtons}
          </ButtonGroup>
          <ButtonGroup className="docs-buttons-group" key="inline">
            {inlineButtons}
            {annotationButtons}
          </ButtonGroup>
          <ButtonGroup className="docs-buttons-group" key="insert">
            {insertButtons}
          </ButtonGroup>
          <ButtonGroup className="docs-buttons-group" key="history">
            {historyButtons}
          </ButtonGroup>
        </div>
      </div>
    );
  }

  _renderHistoryButton = (spec: Spec): React.Element<any> => {
    const {history} = this._editCapability;
    return (
      <DocsEditorToolBarButton
        active={false}
        disabled={!history || !history.has(spec.action)}
        key={spec.action}
        onClick={this._onButtonClick}
        spec={spec}
      />
    );
  };

  _renderAnnotationButton = (spec: Spec): React.Element<any> => {
    const {annotation} = this._editCapability;
    return (
      <DocsEditorToolBarButton
        active={false}
        disabled={!annotation}
        key={spec.action}
        onClick={this._onButtonClick}
        spec={spec}
      />
    );
  };

  _renderBlockStyleButton = (spec: Spec): React.Element<any> => {
    const {blockStyles} = this._editCapability;
    return (
      <DocsEditorToolBarButton
        active={blockStyles ? blockStyles.has(spec.style) : false}
        disabled={!blockStyles}
        key={spec.action}
        onClick={this._onButtonClick}
        spec={spec}
      />
    );
  };

  _renderInlineStyleButton = (spec: Spec): React.Element<any> => {
    const {inlineStyles} = this._editCapability;
    const active = inlineStyles ? inlineStyles.has(spec.style) : false;
    return (
      <DocsEditorToolBarButton
        active={active}
        disabled={inlineStyles === null}
        key={spec.action}
        onClick={this._onButtonClick}
        spec={spec}
      />
    );
  };

  _renderInsertButton = (spec: Spec): React.Element<any> => {
    const editCapability = this._editCapability;
    let disabled = true;
    switch (spec.action) {
      case DocsActionTypes.TABLE_INSERT:
        disabled = !editCapability.table;
        break;
      default:
        disabled = !editCapability.insert;
        break;
    }
    return (
      <DocsEditorToolBarButton
        disabled={disabled}
        key={spec.action}
        onClick={this._onButtonClick}
        spec={spec}
      />
    );
  };

  _onButtonClick = (spec: Spec): void => {
    const editor = this.props.getEditor();
    if (!editor) {
      return;
    }
    const {onChange, editorState} = editor.props;
    if (!onChange  || !editorState) {
      return;
    }

    if (spec.action === DocsActionTypes.TEXT_LINK) {
      const linkEntity = getCurrentSelectionEntity(editorState);
      const url = (linkEntity && linkEntity.getData().url) || '';
      this._linkEditorModal && this._linkEditorModal.dispose();
      this._linkEditorModal = showLinkEditorModalDialog(
        url,
        updateEditorLink.bind(null, editor),
      );
      return;
    }

    if (spec.action === DocsActionTypes.IMAGE_INSERT && spec.modifier) {
      // Insert an empty image placeholder.
      const {docsContext} = this.context;
      const newEditorState = spec.modifier(editorState);
      // Opens a modal to edit it.
      this._imageEditorModal && this._imageEditorModal.dispose();
      this._imageEditorModal = showImageEditorModalDialog(
        docsContext,
        newEditorState,
        onChange,
      );
      return;
    }

    if (spec.action === DocsActionTypes.MATH_INSERT && spec.modifier) {
      // Insert an empty math placeholder.
      const {docsContext} = this.context;
      const newEditorState = spec.modifier(editorState);
      // Opens a modal to edit it.
      this._mathEditorModal && this._mathEditorModal.dispose();
      this._mathEditorModal = showMathEditorModalDialog(
        docsContext,
        newEditorState,
        onChange,
      );
      return;
    }


    const newEditorState =
      maybeInsertBlock(spec, editorState) ||
      maybeFormatInlineText(spec, editorState) ||
      maybeFormatBlockText(spec, editorState) ||
      maybeUpdateHistory(spec, editorState) ||
      maybeUpdateAnnotation(spec, editorState);

    if (newEditorState && newEditorState !== editorState) {
      onChange(newEditorState);
    }
  };

  _maybeWillRerender = (): void => {
    this._timer.clear();
    this._timer.set(this._maybyRerender, 150);
  };

  _maybyRerender = (): void => {
    // If editorState changed, re-render.
    this._timerID = 0;
    const editor = this.props.getEditor();
    if (editor) {
      const {editorState} = editor.props;
      this.setState({editorState: editorState || null});
    }
  };
}

module.exports = docsWithContext(DocsEditorToolBar);
