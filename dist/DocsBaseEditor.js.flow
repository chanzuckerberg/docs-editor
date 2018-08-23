// @flow

import DocsClipboardManager from './DocsClipboardManager';
import DocsCustomStyleMap from './DocsCustomStyleMap';
import DocsEditorBlockRenderer from './DocsEditorBlockRenderer';
import DocsEditorFocusManager from './DocsEditorFocusManager';
import React from 'react';
import Timer from './Timer';
import _ from 'underscore';
import cx from 'classnames';
import splitTextIntoTextBlocks from './splitTextIntoTextBlocks';
import tryBlur from './tryBlur';
import tryFocus from './tryFocus';
import uniqueID from './uniqueID';
import warn from './warn';
import withDocsContext from './withDocsContext';
import {getDefaultKeyBinding, ContentBlock, Editor, EditorState, RichUtils} from 'draft-js';
import {pasteHTML, ensureAtomicBlocksAreSelectable} from './DocsModifiers';

import './DocsBaseEditor.css';

import type {DocsEditorProps} from './Types';

type Props = DocsEditorProps;

// Patch
const selectionPrototype: any = Selection.prototype;
const selectionPrototypeExtend = selectionPrototype.extend;
selectionPrototype.extend = function tryExtendSelection(node, offset) {
  try {
    selectionPrototypeExtend.call(this, node, offset);
  } catch (ex) {
    warn(ex);
  }
};

// Patch
class DraftEditorPatched extends Editor {
  _buildHandler(eventName: string) {
    // Hack to skiop errors while selection changes.
    const handler = super._buildHandler(eventName);
    return (...args) => {
      try {
        return  handler.apply(this, args);
      } catch (ex) {
        warn(ex);
      }
    };
  }
}

const clipboardManager = new DocsClipboardManager();
const focusManager = new DocsEditorFocusManager();

class DocsBaseEditor extends React.PureComponent {
  _editor = null;
  _id = '';
  _lastSelectionState = null;
  _timer = new Timer();
  id = '';

  state = {
    focused: false,
  };

  props: DocsEditorProps;

  constructor(props: Props, context: Object) {
    super(props);
    this._id = props.id || uniqueID();

    const descriptor: any = {
      get: this._getID,
      set: _.noop,
      enumerable: true,
      configurable: false,
    };
    Object.defineProperty(this, 'id', descriptor);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.id !== this.props.id) {
      focusManager.unregister(this._id, this);
      this._id = nextProps.id || uniqueID();
      focusManager.register(this._id, this);
    }
  }

  componentDidMount(): void {
    focusManager.register(this._id, this);
  }

  componentWillUnmount(): void {
    focusManager.unregister(this._id, this);
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const {editorState} = this.props;

    const props: Object = {
      blockRenderMap: DocsEditorBlockRenderer.getBlockRenderMap(),
      blockRendererFn: this._renderBlock,
      blockStyleFn: DocsEditorBlockRenderer.getStyle,
      handleKeyCommand: this._onKeyCommand,
      handlePastedText: this._onPastedText,
      keyBindingFn: getDefaultKeyBinding,
    };

    Object.assign(props, this.props);

    // TODO: Also need to check user's role to see if this is readonly.)
    const readOnly = !this.state.focused || !this.context.docsContext.canEdit;
    const className = cx({
      'docs-base-editor': true,
      'docs-font-default': true,
      'docs-base-editor-readonly': readOnly,
    });

    return (
      <div
        className={className}
        data-docs-editor-for={this._id}
        id={this._id}>
        <DraftEditorPatched
          {...props}
          customStyleMap={DocsCustomStyleMap}
          editorState={ensureAtomicBlocksAreSelectable(editorState)}
          onChange={this._onChange}
          readOnly={readOnly}
          ref={this._onEditorRef}
        />
      </div>
    );
  }

  focus(resumeSelection: ?boolean): void {
    if (this._editor && !this.state.focused) {
      // Enable the editor.
      this.setState({focused: true});
      this._doFocus();
    }
  }

  blur(): void {
    const {editorState} = this.props;
    const selectionState = editorState.getSelection();
    this._lastSelectionState = selectionState;

    if (this._editor && this.state.focused) {
      this.setState({focused: false});
      this._doBlur();
    }
  }

  _getID = (): string => {
    return this._id;
  };

  _onEditorRef = (ref: any): void => {
    this._editor = ref;
  };

  _onPastedText = (text: string, html: string): boolean => {
    const {event} = window;
    const editor = this._editor;
    if (event && editor) {
      // This block is forked from
      // `draft-js/src/component/handlers/edit/editOnPaste.js`.
      // If the text from the paste event is rich content that matches what we
      // already have on the internal clipboard, assume that we should just use
      // the clipboard fragment for the paste. This will allow us to preserve
      // styling and entities, if any are present. Note that newlines are
      // stripped during comparison -- this is because copy/paste within the
      // editor in Firefox and IE will not include empty lines. The resulting
      // paste will preserve the newlines correctly.
      const internalClipboard = editor.getClipboard();
      const clipboardData = clipboardManager.getClipboardData();
      if (clipboardData && clipboardData.isRichText() && internalClipboard) {
        if (html.indexOf(editor.getEditorKey()) > -1) {
          // If the editorKey is present in the pasted HTML, it should be safe
          // to assume this is an internal paste.
          return false;
        }
        const textBlocks = text ? splitTextIntoTextBlocks(text) : [];
        if (
          textBlocks.length === 1 &&
          internalClipboard.size === 1 &&
          internalClipboard.first().getText() === text
        ) {
          return false;
        }
      }
    }

    const {editorState} = this.props;
    const newEditorState = pasteHTML(
      editorState,
      html || splitTextIntoTextBlocks(text).join('<br />'),
    );
    if (newEditorState !== editorState) {
      this._onChange(newEditorState);
      return true;
    }
    return false;
  };


  _onKeyCommand = (command: string): ?string => {
    // https://github.com/facebook/draft-js/issues/915
    const {editorState} = this.props;
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState && newEditorState !== editorState) {
      this._timer.clear();
      this._timer.set(() => {
        this._onChange(newEditorState);
      });
      return 'handled';
    }
    return 'not-handled';
  };

  _onChange = (editorState: EditorState): void => {
    this.props.onChange(ensureAtomicBlocksAreSelectable(editorState));
  };

  _renderBlock = (conetntBlock: ContentBlock): ?Object => {
    const {editorState} = this.props;
    const blockProps = {
      editorState,
      onChange: this._onChange,
    };
    return DocsEditorBlockRenderer.renderBlock(conetntBlock, blockProps);
  };

  _doFocus = (): void => {
    if (!this._editor) {
      return;
    }
    tryFocus(this._editor);
    this._resumeFocusSelection();
  };

  _doBlur = (): void => {
    if (!this._editor) {
      return;
    }
    tryBlur(this._editor);
  };

  _resumeFocusSelection(): void {
    const selectionState = this._lastSelectionState;
    if (!this.state.focused || !selectionState) {
      return;
    }
    this._lastSelectionState = null;
    const {editorState} = this.props;
    const nextEditorState = EditorState.forceSelection(
      editorState,
      selectionState,
    );
    this._onChange(nextEditorState);
  }
}

module.exports = withDocsContext(DocsBaseEditor);
