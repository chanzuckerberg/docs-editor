// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import captureDocumentEvents from './captureDocumentEvents';
import {Popover} from 'react-bootstrap';
import uniqueID from './uniqueID';

type Props = {
  View: Function,
  id: string,
  onCancel: () => void,
  onConfirm: (v: any) => void,
  title?: ?string,
  viewProps: Object,
};


class Modal extends React.PureComponent {
  _eventsCapture = null;
  _startTime = Date.now();
  _unmounted = false;

  props: Props;

  render(): React.Element<any> {
    const {id, title, viewProps, onConfirm, onCancel, View} = this.props;
    return (
      <Popover
        className="modal-dialog"
        id={id}
        placement="top"
        title={title}>
        <View
          {...viewProps}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </Popover>
    );
  }

  componentDidMount(): void {
    this._eventsCapture = captureDocumentEvents({
      click: this._onEventCapture,
      mousedown: this._onEventCapture,
    });
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    this._eventsCapture && this._eventsCapture.dispose();
  }

  _onEventCapture = (e: any) => {
    const {id} = this.props;
    const target = e.target;
    const node = document.getElementById(id);
    const inComponent = node === target || (node && node.contains(target));
    if (inComponent) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    // Prevents the initial click from dismissing it.
    const delta = Date.now() - this._startTime;
    const dismissable =  delta >= 500 && e.type === 'click';
    dismissable && this._autoDismiss();
  };

  _autoDismiss = (): void => {
    !this._unmounted && this.props.onCancel();
  };
}

function getRootElement(id: string): HTMLElement {
  const root: any = document.body || document.documentElement;
  const element = document.getElementById(id) || document.createElement('div');
  element.className = 'modal-dialog-root';
  element.id = id;
  if (!element.parentElement) {
    root.insertBefore(element, element.firstChild);
  }
  return element;
}

function renderModal(props: Props): void {
  const {id} = props;
  const rootNode = getRootElement(id);
  const component = <Modal {...props} id={id + '-modal'}/>;
  ReactDOM.render(component, rootNode);
}

function unrenderModal(props: Props): void {
  const {id} = props;
  const rootNode = getRootElement(id);
  ReactDOM.unmountComponentAtNode(rootNode);
  rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
}

function docsShowModalDialog(
  View: Function,
  viewProps: Object,
): Promise<any> {
  return new Promise((resolve) => {
    const props = {
      View,
      viewProps,
      id: uniqueID(),
      onCancel: () => {
        unrenderModal(props);
        resolve(undefined);
      },
      onConfirm: (value) => {
        unrenderModal(props);
        resolve(value);
      },
    };
    renderModal(props);
  });
}

module.exports = docsShowModalDialog;
