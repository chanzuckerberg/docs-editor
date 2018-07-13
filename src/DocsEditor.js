// @flow

import DocsBaseEditor from './DocsBaseEditor';
import DocsConfig from './DocsConfig';
import DocsDataAttributes from './DocsDataAttributes';
import DocsEditorContentOverflowControl from './DocsEditorContentOverflowControl';
import DocsEditorFocusManager from './DocsEditorFocusManager';
import DocsEditorToolBar from './DocsEditorToolBar';
import DocsEventTypes from './DocsEventTypes';
import DocsResourcesLoader from './DocsResourcesLoader';
import React from 'react';
import ReactDOM from 'react-dom';
import ResizeObserver from './ResizeObserver';
import Timer from '../lib/Timer';
import cx from 'classnames';
import docsWithContext from './docsWithContext';
import invariant from 'invariant';
import {asElement, uniqueID} from './DocsHelpers';

import './DocsEditor.css';

import type {BaseEditor, EditorProps} from './Types';
import type {ResizeObserverEntry} from './ResizeObserver';

type Props = EditorProps;

type ContentOverflowInfo = {
  className?: ?string,
  control?: ?React.Element<any>,
  style?: ?Object,
};

DocsConfig.init();
DocsResourcesLoader.init();

const {FOCUS_TRANSITION_DURATION_MS} = DocsEditorFocusManager;

class DocsEditor extends React.PureComponent {

  props: Props & {
    className?: ?string,
    disabled?: ?boolean,
    height?: ?(string | number),
    maxContentHeight?: ?number,
    onBlur: () => void,
    width?: ?(string | number),
  };

  _activeEditor = null;
  _blurTimer = new Timer();
  _editor = null;
  _element = null;
  _id = uniqueID();
  _nodeListening = null;

  state = {
    contentHeight: NaN,
    contentOverflowHidden: true,
    key: uniqueID(),
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.docsContext !== this.props.docsContext) {
      // We're passing `this.props.docsContext` down to descending components
      // which can access it via `this.context.docsContext`.
      // However, React does not update the received context for the
      // descending components if they are made with `React.PureComponent`
      // which are commonly used in docs editor. To force the descending
      // components receive new context, this generates a new key that will
      // build a new component tree with updated context.
      // Note that `docsContext` does not change often, if it does change, it
      // often requires a full UI re-render.
      // see https://medium.com/@mweststrate/b7e343eff076 to learn more
      // about `context` and `PureComponent`.
      this.setState({key: uniqueID()});
    }
  }

  componentWillUnmount(): void {
    this._unlisten();
    this._blurTimer.dispose();
  }

  render(): React.Element<any> {
    const {
      className,
      disabled,
      docsContext,
      editorState,
      height,
      id,
      onChange,
      placeholder,
      width,
    } = this.props;

    // TODO: Needs a safter way to handle this.
    invariant(docsContext, 'prop `docsContext` is required');

    const activeEditor = this._activeEditor;
    const placeholderText = (docsContext.canEdit && activeEditor) ?
      (placeholder || 'Type something') :
      '';

    const editorId = id || this._id;
    const attrs = {
      [DocsDataAttributes.EDITOR_FOR]: editorId,
    };

    const useFixedLayout = width !== undefined || height !== undefined;

    const style = {
      width: width === undefined && useFixedLayout ? 'auto' : width,
      height: height === undefined && useFixedLayout ? 'auto' : height,
    };

    const contentOverflowInfo = this._computeContentOverflowInfo();

    const mainClassName = cx(className, {
      'docs-editor': true,
      'docs-font-default': true,
      'docs-editor-with-fixed-layout': useFixedLayout,
      'docs-editor-disabled': disabled,
    });

    return (
      <div
        {...attrs}
        key={this.state.key}
        style={style}
        className={mainClassName}
        ref={this._onElementRef}>
        <div className="docs-editor-frameset">
          <div className="docs-editor-frame-head">
            <DocsEditorToolBar
              {...this.props}
              {...this.state}
              getEditor={this._getEditor}
            />
          </div>
          <div className="docs-editor-frame-body">
            <div
              className={cx(
                'docs-editor-frame-body-scroll',
                contentOverflowInfo.className,
              )}
              style={contentOverflowInfo.style}>
              <DocsBaseEditor
                editorState={editorState}
                id={editorId}
                onChange={onChange}
                placeholder={placeholderText}
                ref={this._onEditorRef}
              />
            </div>
          </div>
          <div className="docs-editor-frame-footer">
            {contentOverflowInfo.control}
          </div>
        </div>
      </div>
    );
  }

  _getEditor = (): ?BaseEditor => {
    return this._activeEditor;
  };

  _onEditorRef = (ref: any) => {
    if (ref) {
      // Mounting
      const el = asElement(ReactDOM.findDOMNode(ref));
      ResizeObserver.observe(el, this._onContentResize);
    } else {
      // Unmounting.
      const el = asElement(ReactDOM.findDOMNode(this._editor));
      ResizeObserver.unobserve(el);
    }
    this._editor = ref;
  };

  _onEditorIn = (event: any) => {
    const editor = event.detail ? event.detail.editor : null;
    if (this._activeEditor !== editor) {
      this._activeEditor = editor;
      this.forceUpdate();
    }
    this._blurTimer.clear();
  };

  _onEditorOut = (event: any) => {
    if (this._activeEditor) {
      this._activeEditor = null;
      this.forceUpdate();
    }

    // Schedule a call of `this._onBlur` if the editor is fully blurred.
    this._blurTimer.clear();
    this._blurTimer.set(this._onBlur, FOCUS_TRANSITION_DURATION_MS);
  };

  _onBlur = (): void => {
    const {docsContext, onBlur} = this.props;
    if (onBlur && docsContext && docsContext.canEdit) {
      onBlur();
    }
  };

  _onElementRef = (ref: any) => {
    this._unlisten();
    this._element = ref;
    this._listen();
  };

  _listen(): void {
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

  _onContentResize = (info: ResizeObserverEntry): void => {
    this.setState({
      contentHeight: info.contentRect.height,
    });
  };

  _onContentOverflowToggle = (contentOverflowHidden: boolean): void => {
    this.setState({
      contentOverflowHidden,
    });
  };

  _computeContentOverflowInfo(): ContentOverflowInfo {
    const {maxContentHeight} = this.props;
    const {contentHeight, contentOverflowHidden} = this.state;
    if (
      contentHeight === null ||
      maxContentHeight === null ||
      maxContentHeight === undefined ||
      contentHeight <= maxContentHeight
    ) {
      // nothing to clamp.
      return {};
    }

    // Content could be clamped.
    const style = contentOverflowHidden ?
       {
         maxHeight: String(maxContentHeight) + 'px',
       } :
       null;

    const control =
      <DocsEditorContentOverflowControl
        contentOverflowHidden={contentOverflowHidden}
        onToggle={this._onContentOverflowToggle}
      />;

    const className = contentOverflowHidden ?
      'docs-editor-content-overflow-clamped' :
      null;

    return {
      style,
      control,
      className,
    };
  }
}

module.exports = docsWithContext(DocsEditor);
