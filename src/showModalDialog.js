// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import captureDocumentEvents from './captureDocumentEvents';
import nullthrows from 'nullthrows';
import uniqueID from './uniqueID';
import {Popover} from 'react-bootstrap';

import './showModalDialog.css';

export type ModalHandle = {
  dispose: () => void,
  update: (viewProps: Object) => void,
};

type Props = {
  View: Function,
  autoDimiss?: ?boolean,
  id: string,
  onCancel: () => void,
  onConfirm: (v: any) => void,
  viewProps: Object,
};

export type ModalDialogProps = {
  onCancel: () => void,
  onConfirm: (response: any) => void,
};

let openModalCount = 0;
let bodyScrollPosition = 0;
function preserveBodyScrollPosition() {
  openModalCount++;

  if (openModalCount > 1) {
    return;
  }

  bodyScrollPosition = window.pageYOffset;
  nullthrows(document.body).style.top = `-${bodyScrollPosition}px`;
  nullthrows(document.body).classList.add('no-scroll-body');
}

function restoreBodyScrollPosition() {
  openModalCount--;

  if (openModalCount > 0) {
    return;
  }

  nullthrows(document.body).classList.remove('no-scroll-body');
  window.scrollTo(0, bodyScrollPosition);
  nullthrows(document.body).style.top = '0';
  bodyScrollPosition = 0;
}

const ROOT_CLASS_NAME = 'global-modal-dialog-root';

class Modal extends React.PureComponent {
  _clickStartTarget = null;
  _clickStartTime = 0;
  _eventsCapture = null;
  _unmounted = false;

  props: Props;

  render(): React.Element<any> {
    const {id, viewProps, onConfirm, onCancel, View} = this.props;
    return (
      <Popover
        className="global-modal-dialog"
        id={id}
        onKeyDown={this._onKeyDown}
        placement="top"
      >
        <View {...viewProps} onCancel={onCancel} onConfirm={onConfirm} />
      </Popover>
    );
  }

  componentDidMount(): void {
    this._eventsCapture = captureDocumentEvents({
      mousedown: this._onEventCapture,
      mouseup: this._onEventCapture,
    });
    preserveBodyScrollPosition();
    // move keyboard focus into modal automatically
    const focusableElements = this._findFocusableElements();
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    this._eventsCapture && this._eventsCapture.dispose();
    restoreBodyScrollPosition();
  }

  _findFocusableElements = (): Array<HTMLElement> => {
    const modalRoot = document.getElementById(this.props.id);
    if (!modalRoot) {
      return [];
    }
    // Focusable selectors list from https://stackoverflow.com/a/30753870
    const selector = `button:not([disabled]), [href], iframe, input:not([disabled]), select:not([disabled]),
      textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contentEditable=true]`;
    return Array.from(modalRoot.querySelectorAll(selector)).filter(
      element => !!element.offsetHeight
    );
  };

  _onEventCapture = (e: any) => {
    const {id, autoDimiss} = this.props;
    if (!autoDimiss) {
      this._resetClick();
      return;
    }

    const {target, type} = e;
    const node = document.getElementById(id);

    const inComponent = node === target || (node && node.contains(target));
    if (inComponent) {
      this._resetClick();
      return;
    }

    const parentNode: any = node ? node.parentElement : null;
    if (
      parentNode &&
      parentNode.getAttribute &&
      parentNode.getAttribute('aria-hidden') === 'true'
    ) {
      // Touched a modal that is not interactive.
      this._resetClick();
      return;
    }

    // Find all app alerts.
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alert_role
    const alertNodes = document.querySelectorAll('[role="alert"]');
    const inAlert = Array.from(alertNodes).some(an => {
      return an === target || an.contains(target);
    });

    if (inAlert) {
      // Touched an alert dialog. Interacting with the alert (e.g. dismiss it)
      // should not dismiss the modal.
      this._resetClick();
      return;
    }

    if (type === 'mouseup' && !this._clickStartTime) {
      // It does not create a click.
      this._resetClick();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // This checks if user did click outside of the modal dialog.
    // Both `mousedown` and `mouseup` must happen outside of the modal's
    // element. The interaction must finish within 500ms, just like a real
    // click.
    if (type === 'mousedown') {
      this._clickStartTime = Date.now();
      this._clickStartTarget = target;
    } else if (
      type === 'mouseup' &&
      this._clickStartTime &&
      this._clickStartTarget === target
    ) {
      const delta = Date.now() - this._clickStartTime;
      const clickedOutside = delta <= 500;
      clickedOutside && this._autoDismiss();
      this._resetClick();
    }
  };

  // Follows https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
  _onKeyDown = (e: SyntheticKeyboardEvent<>): void => {
    if (e.key !== 'Tab') {
      return;
    }
    const focusableElements = this._findFocusableElements();
    if (!focusableElements.length) {
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const {target} = e;

    if (firstFocusableElement === lastFocusableElement) {
      e.preventDefault();
    } else if (e.shiftKey) {
      if (target === firstFocusableElement) {
        // shift + tab pressed on first element, wrap back to last
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else if (target === lastFocusableElement) {
      // tab pressed on last element, wrap back to first
      firstFocusableElement.focus();
      e.preventDefault();
    }
  };

  _autoDismiss = (): void => {
    !this._unmounted && this.props.onCancel();
  };

  _resetClick() {
    this._clickStartTarget = null;
    this._clickStartTime = 0;
  }
}

function getRootElement(id: string): HTMLElement {
  const root: any = document.body || document.documentElement;
  const element = document.getElementById(id) || document.createElement('div');
  element.className = ROOT_CLASS_NAME + ' docs-font-default';
  element.id = id;
  // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  if (!element.parentElement) {
    root.appendChild(element);
  }
  return element;
}

function renderModal(props: Props): void {
  const {id} = props;
  const rootNode = getRootElement(id);
  const component = <Modal {...props} id={id + '-modal'} />;
  ReactDOM.render(component, rootNode);
  resetModalsAccessibility();
}

function unrenderModal(props: Props): void {
  const {id} = props;
  const rootNode = getRootElement(id);
  ReactDOM.unmountComponentAtNode(rootNode);
  rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  resetModalsAccessibility();
}

// https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/dialog-modal/dialog.html
function resetModalsAccessibility(): void {
  const els = document.querySelectorAll('.' + ROOT_CLASS_NAME);
  const lastIndex = els.length - 1;
  let ii = 0;
  while (ii <= lastIndex) {
    const el = els[ii];
    if (ii < lastIndex) {
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('aria-hidden');
    }
    ii++;
  }
}

function showModalDialog(
  View: Function,
  modalProps: Object,
  callback?: ?Function,
): ModalHandle {
  let done = false;
  const {autoDimiss, ...viewProps} = modalProps;
  const props = {
    View,
    autoDimiss,
    viewProps,
    id: uniqueID(),
    onCancel: () => {
      if (!done) {
        done = true;
        unrenderModal(props);
        callback && callback(undefined);
      }
    },
    onConfirm: (value) => {
      if (!done) {
        done = true;
        unrenderModal(props);
        callback && callback(value);
      }
    },
  };
  renderModal(props);
  return {
    dispose(): void {
      // Close the modal dialog and silence the callback.
      callback = null;
      props.onCancel();
    },
    update(nextViewProps: Object): void {
      if (!done) {
        const nextProps = {
          ...props,
          viewProps: nextViewProps,
        };
        renderModal(nextProps);
      }
    },
  };
}

module.exports = showModalDialog;
