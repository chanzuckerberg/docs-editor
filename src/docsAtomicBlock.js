// @flow

import DocsDataAttributes from './DocsDataAttributes';
import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './Timer';
import invariant from 'invariant';
import nullthrows from 'nullthrows';
import {ContentBlock, EditorState, Entity} from 'draft-js';
import captureDocumentEvents from './captureDocumentEvents';

type Props = {
  block: ContentBlock,
  blockProps: {
    editorState: EditorState,
    entity: Entity,
    entityKey: string,
    onChange: (e: EditorState) => void,
  },
};

type Spec = {
  blockType: string,
};

class DocsAtomicBlock extends React.PureComponent {

  props: Props;

  _WrappedComponent = null;
  _atomicNode = null;
  _eventsCapture = null;
  _ref = null;
  _spec = null;
  _timer = new Timer();

  constructor(
    WrappedComponent: Function,
    spec: Spec,
    props: Object,
    context: Object,
  ) {
    super(props, context);
    this._WrappedComponent = WrappedComponent;
    this._spec = spec;
  }

  componentWillUnmount(): void {
    this._unlisten();
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const WrappedComponent = nullthrows(this._WrappedComponent);
    return <WrappedComponent {...this.props} ref={this._onRef} />;
  }

  _onRef = (ref: any) => {
    this._ref = ref;
    this._listen();
  };

  _onBeforeCopy = (e: any): void => {
    // TODO: Lazily record the data only if the selection contains the
    // node.
    this._timer.clear();
    this._writeEntityData();
  };

  _onBeforeCut = (e: any): void => {
    // TODO: Lazily record the data only if the selection contains the
    // node.
    this._timer.clear();
    this._writeEntityData();
  };

  _onPaste = (e: any): void => {
    // TODO: Lazily record the data only if the selection contains the
    // node.
    this._timer.set(this._eraseEntityData);
  };


  _listen(): void {
    if (this._eventsCapture || !this._ref) {
      return;
    }
    this._eventsCapture = captureDocumentEvents({
      'beforecopy': this._onBeforeCopy,
      'beforecut': this._onBeforeCut,
    });
  }

  _unlisten(): void {
    if (!this._eventsCapture) {
      return;
    }
    this._eventsCapture.dispose();
    this._eventsCapture = null;
  }

  _writeEntityData(): void {
    // Wtites the state of the AtomicBlock into DOM element so that its state
    // could be copied and pasted into a different editor. See `pasteHTML`
    // at `DocsModifier` and see how the data is being parsed.
    if (!this._ref) {
      return;
    }
    // Inject EntityData as node so that they could be copied.0
    const {blockProps} = this.props;
    const {entity} = blockProps;
    const node: any = nullthrows(ReactDOM.findDOMNode(this._ref));
    const atomicNode: any = nullthrows(node.parentNode);
    invariant(
      atomicNode.nodeName === 'FIGURE' && atomicNode.hasAttribute('data-block'),
      'atomicNode not found',
    );
    const meta = {
      entityData: entity.getData(),
      blockType: nullthrows(this._spec).blockType,
    };
    atomicNode.setAttribute(
      DocsDataAttributes.ATOMIC_BLOCK_DATA,
      JSON.stringify(meta),
    );
    this._atomicNode = atomicNode;
  }

  _eraseEntityData = (): void => {
    if (!this._ref || !this._atomicNode) {
      return;
    }
    this._atomicNode.removeAttribute(DocsDataAttributes.ATOMIC_BLOCK_DATA);
    this._atomicNode = null;
  };
}

function docsAtomicBlock(Component: Function, spec: Spec): Function {
  const fn: Function = DocsAtomicBlock;
  return fn.bind(null, Component, spec);
}

module.exports = docsAtomicBlock;
