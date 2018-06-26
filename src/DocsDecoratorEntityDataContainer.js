// @flow

import DocsDataAttributes from './DocsDataAttributes';
import DocsEventTypes from './DocsEventTypes';
import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './Timer';
import captureDocumentEvents from './captureDocumentEvents';
import cx from 'classnames';
import invariant from 'invariant';
import nullthrows from 'nullthrows';
import {ContentState, Entity} from 'draft-js';
import {createDOMCustomEvent} from './DocsHelpers';
import {uniqueID, asElement, lookupElementByAttribute} from './DocsHelpers';

type Props = {
  contentState: ContentState,
  entityKey: string,
  children?: any,
};

class DocsDecoratorEntityDataContainer extends React.PureComponent {

  props: Props;

  _WrappedComponent = null;
  _decoratorType = '';
  _eventsCapture = null;
  _id = uniqueID();
  _node = null;
  _timer = new Timer();
  _unmounted = false;

  constructor(
    WrappedComponent: Function,
    decoratorType: string,
    props: Object,
    context: Object,
  ) {
    super(props, context);
    this._decoratorType = decoratorType;
    this._WrappedComponent = WrappedComponent;
  }

  componentDidMount(): void {
    this._listen();
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    this._unlisten();
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const WrappedComponent = nullthrows(this._WrappedComponent);
    const entity = this._getEntity();
    const entityData = entity.getData();
    const {align} = entityData;
    const className = cx({
      'docs-decorator-container': true,
      'docs-decorator-container-align-left': align === 'left',
      'docs-decorator-container-align-right': align === 'right',
      'docs-decorator-container-align-center': align === 'center',
    });

    const attrs = {
      [DocsDataAttributes.DECORATOR_TYPE]: this._decoratorType,
      [DocsDataAttributes.ELEMENT]: true,
    };

    const {children} = this.props;
    const immutable = entity.getMutability() === 'IMMUTABLE';
    // If immutable, assume children may not be rendered, thus render
    // children here instead to keep the character data visible.
    if (immutable) {
      return (
        <span {...attrs} className={className}>
          <WrappedComponent
            entityData={entityData}
            onEntityDataChange={this._onEntityDataChange}
          />
          {children}
        </span>
      );
    } else {
      return (
        <WrappedComponent
          {...attrs}
          children={children}
          className={className}
          entityData={entityData}
          onEntityDataChange={this._onEntityDataChange}
        />
      );
    }
  }

  _onEntityDataChange = (entityData: Object): void => {
    const editor = this._getEditorElement();
    if (!editor) {
      return;
    }
    const {entityKey} = this.props;
    const detail = {
      entityKey,
      entityData,
    };
    // Workaround to let editor to catch this change.
    // See `DocsEditorFocusManager`.
    const event = createDOMCustomEvent(
      DocsEventTypes.EDITOR_REQUEST_UPDATE_ENTITY_DATA,
      true,
      true,
      detail,
    );
    editor.dispatchEvent(event);
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

  _getEditorElement(): ?Element {
    return lookupElementByAttribute(
      asElement(ReactDOM.findDOMNode(this)),
      DocsDataAttributes.EDITOR_FOR,
    );
  }

  _listen(): void {
    if (this._eventsCapture || this._unmounted) {
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
    this._eventsCapture && this._eventsCapture.dispose();
    this._eventsCapture = null;
  }

  _writeEntityData(): void {
    // Wtites the state of the AtomicBlock into DOM element so that its state
    // could be copied and pasted into a different editor. See `pasteHTML`
    // at `DocsModifier` and see how the data is being parsed.
    if (this._unmounted) {
      return;
    }
    // Inject EntityData as node so that they could be copied.0
    const node: Element = asElement(ReactDOM.findDOMNode(this));
    invariant(node.nodeType === 1, 'must be an element');
    this._node = node;

    const entity = this._getEntity();
    const rawEntity = {
      data: entity.getData(),
      type: entity.getType(),
      mutability: entity.getMutability(),
    };
    node.setAttribute(
      DocsDataAttributes.DECORATOR_DATA,
      JSON.stringify(rawEntity),
    );
  }

  _eraseEntityData = (): void => {
    if (!this._node) {
      return;
    }
    this._node.removeAttribute(DocsDataAttributes.DECORATOR_DATA);
    this._node = null;
  };

  _getEntity(): Entity {
    const {contentState, entityKey} = this.props;
    return nullthrows(nullthrows(contentState).getEntity(entityKey));
  }
}

module.exports = DocsDecoratorEntityDataContainer;
