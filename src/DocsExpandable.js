// @flow

import DocsBaseEditor from './DocsBaseEditor';
import DocsDataAttributes from './DocsDataAttributes';
import DocsEventTypes from './DocsEventTypes';
import DocsTextInputEditor from './DocsTextInputEditor';
import DocsIcon from './DocsIcon';
import React from 'react';
import ReactDOM from 'react-dom';
import Timer from '../lib/Timer';
import cx from 'classnames';
import docsConvertFromRawContentState from './docsConvertFromRawContentState';
import showModalDialog from '../lib/showModalDialog';
import docsWithContext from './docsWithContext';
import {convertToRaw, ContentBlock, EditorState, Entity} from 'draft-js';
import {uniqueID} from './DocsHelpers';
import {updateEntityData} from './DocsModifiers';
import {updateLabel} from './DocsExpandableModifiers';

import './DocsExpandable.css';

import type {BaseEditor} from './Types';
import type {ModalHandle} from '../lib/showModalDialog';

type Props = {
  block: ContentBlock,
  blockProps: {
    editorState: EditorState,
    entity: Entity,
    entityKey: string,
    onChange: (e: EditorState) => void,
  },
};

const LOCAL_CHANGE_ID = '_docs_expandable_local_change';

function showLabelEditorModalDialog(
  title: string,
  label: string,
  callback: Function,
): ModalHandle {
  return showModalDialog(DocsTextInputEditor, {
    title,
    value: label,
  }, callback);
}

function getLocalEditorState(props: Props): EditorState {
  const {blockProps} = props;
  const {entity} = blockProps;
  const {body} = entity.getData();
  return docsConvertFromRawContentState(body);
}

function isExpanded(props: Props): boolean {
  const {blockProps} = props;
  const {entity} = blockProps;
  return !!entity.getData().show;
}

function getLocalChangeID(props: Props): ?string {
  const {blockProps} = props;
  const {entity} = blockProps;
  const data = entity.getData();
  return data ? data[LOCAL_CHANGE_ID] : null;
}

class DocsExpandable extends React.PureComponent {
  _activeEditor = null;
  _editor = null;
  _element = null;
  _labelEditorModal = null;
  _localChangeID = null;
  _nodeListening: null;
  _timer = new Timer();

  props: Props;

  state = {
    expanded: isExpanded(this.props),
    localEditorState: getLocalEditorState(this.props),
  };

  componentWillReceiveProps(nextProps: Props): void {
    // Sync local editor state.
    const id = getLocalChangeID(nextProps);
    if (id !== this._localChangeID) {
      this._localChangeID = id;
      this._timer.clear();
      this.setState({
        expanded: isExpanded(nextProps),
        localEditorState: getLocalEditorState(nextProps),
      });
    }
  }

  componentWillUnmount(): void {
    this._unlisten();
    this._labelEditorModal && this._labelEditorModal.dispose();
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const {canEdit} = this.context.docsContext;
    const {localEditorState, expanded} = this.state;
    const {blockProps} = this.props;
    const {entity} = blockProps;
    const activeEditor = this._activeEditor;
    const data = entity.getData();

    const editorID = activeEditor ? activeEditor.id : null;
    const className = cx({
      'docs-expandable-main': true,
      'docs-expandable-active': !!editorID,
      'docs-expandable-expanded': expanded,
    });
    const showLabel = expanded ?
      (data.hideLabel || 'Show Less'):
      (data.showLabel || 'Show More');

    const placeholder = canEdit ? 'type something' : '';
    const editLabel = canEdit ?
      <DocsIcon
        className="docs-expandable-toggle-icon"
        data-docs-tool="true"
        icon="create"
        onMouseDown={this._onEditLabel}
      /> :
      null;

    const attrs = {
      [DocsDataAttributes.EDITOR_FOR]: editorID,
    };
    const toggleAttrs = {
      [DocsDataAttributes.TOOL]: true,
    };

    return (
      <div
        {...attrs}
        className={className}
        contentEditable={false}
        ref={this._onElementRef}>
        <span
          {...toggleAttrs}
          className="docs-expandable-toggle"
          onClick={this._onToggle}>
          {showLabel}
        </span>
        {editLabel}
        <div className="docs-expandable-body">
          <DocsBaseEditor
            editorState={localEditorState}
            id={editorID}
            onChange={this._onChange}
            placeholder={placeholder}
            ref={this._onEditorRef}
          />
        </div>
      </div>
    );
  }

  _onElementRef = (ref: any) => {
    this._unlisten();
    this._element = ref;
    this._listen();
  };

  _onEditorRef = (ref: any) => {
    this._editor = ref;
  };

  _onEditorIn = (event: any) => {
    let editor = event.detail ? event.detail.editor : null;
    if (editor !== this._editor) {
      // ignore nested editor.
      editor = null;
    }
    if (editor === this._activeEditor) {
      return;
    }

    // Hack. Need to expose this to state immediately.
    this._activeEditor = editor;
    this.forceUpdate();
  };

  _onEditorOut = (event: any) => {
    if (this._activeEditor) {
      this._activeEditor = null;
      this.forceUpdate();
    }
  };

  _onToggle = (event: any) => {
    event.preventDefault();
    this.setState({expanded: !this.state.expanded}, this._notifyChange);
  };

  _onEditLabel = (event: any) => {
    event.preventDefault();

    const {blockProps} = this.props;
    const {entity} = blockProps;
    const entityData = entity.getData();
    const {expanded} = this.state;
    const title = expanded ?
      'Change the label for "Show Less"' :
      'Change the label for "Show More"';

    const label = expanded ?
      entityData.hideLabel || 'Show Less' :
      entityData.showLabel || 'Show More';
    this._labelEditorModal = showLabelEditorModalDialog(
      title,
      label,
      this._updateLabel,
    );
  };

  _updateLabel = (label: ?string): void => {
    if (!this._editor || !label) {
      // Unmounted.
      return;
    }
    const {editorState, onChange, entity, entityKey} = this.props.blockProps;
    const entityData = entity.getData();
    const newEntityData = updateLabel(entityData, label || '');
    const newEditorState = updateEntityData(
      editorState,
      entityKey,
      newEntityData,
    );
    onChange(newEditorState);
  };

  _getEditor = (): ?BaseEditor => {
    return this._activeEditor;
  };

  _listen(): void {
    if (!this.context.docsContext.canEdit) {
      return;
    }
    const node: any = this._element ?
      ReactDOM.findDOMNode(this._element) :
      null;
    if (node) {
      node.addEventListener(
        DocsEventTypes.EDITOR_IN,
        this._onEditorIn,
        false,
      );
      node.addEventListener(
        DocsEventTypes.EDITOR_OUT,
        this._onEditorOut,
        true,
      );
      this._nodeListening = node;
    }
  }

  _unlisten(): void {
    if (!this._nodeListening) {
      return;
    }
    const node = this._nodeListening;
    this._nodeListening = null;
    if (node) {
      node.removeEventListener(
        DocsEventTypes.EDITOR_IN,
        this._onEditorIn,
        false,
      );
      node.removeEventListener(
        DocsEventTypes.EDITOR_OUT,
        this._onEditorOut,
        true,
      );
    }
  }

  _onChange = (localEditorState: EditorState): void => {
    if (!this.context.docsContext.canEdit) {
      return;
    }
    // Effectively and optimistically commit change locally then sync later.
    this.setState({localEditorState}, this._notifyChange);
  };

  _notifyChange = () => {
    if (!this.context.docsContext.canEdit) {
      return;
    }
    this._timer.clear();
    this._timer.set(this._notifyChangeImmediate, 250);
  };

  _notifyChangeImmediate = () => {
    this._timer.clear();
    if (!this._editor) {
      // Unmounted.
      return;
    }
    const {localEditorState} = this.state;
    const contenState = localEditorState.getCurrentContent();
    const {editorState, onChange, entity, entityKey} = this.props.blockProps;
    const entityData = entity.getData();
    const localChangeID = uniqueID();
    const newEntityData = {
      ...entityData,
      body: convertToRaw(contenState),
      show: this.state.expanded,
      [LOCAL_CHANGE_ID]: localChangeID,
    };
    const newEditorState = updateEntityData(
      editorState,
      entityKey,
      newEntityData,
    );
    this._localChangeID = localChangeID;
    onChange(newEditorState);
  };

  _autoFocus = () => {
    this._editor && this._editor.focus();
  };
}

module.exports = docsWithContext(DocsExpandable);
