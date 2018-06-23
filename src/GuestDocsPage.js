// @flow

import DocsContext from './DocsContext';
import DocsPage from './DocsPage';
import React from 'react';
import Timer from './Timer';
import URI from 'uri-js';
import captureDocumentEvents from 'v2/core/util/captureDocumentEvents';
import cx from 'classnames';
import docsConvertFromRawContentState from './docsConvertFromRawContentState';
import queryString from 'query-string';
import {Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem} from 'react-bootstrap';
import {browserHistory} from 'react-router';
import {convertToRaw, EditorState} from './DraftJS';
import {uniqueID} from './DocsHelpers';

const URL = URI.parse(window.location.href);
const PARAMS = queryString.parse(URL.query);
const TEMPLATE = parseInt(PARAMS.template, 10);

class TemplateDropDown extends React.PureComponent {
  _id = uniqueID();
  _timer = new Timer();
  _unmounted = false;

  state = {
    templates: window.$docs_templates,
  };

  componentDidMount(): void {
    if (!this.state.templates) {
      window.addEventListener('load', () => {
        if (window.$docs_templates) {
          this.setState({templates: window.$docs_templates});
          if (!isNaN(TEMPLATE) && window.$docs_templates[TEMPLATE]) {
            this._onSelect(TEMPLATE);
          }
        }
      });
    }
  }
  componentWillUnmount(): void {
    this._unmounted = true;
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const {templates} = this.state;
    const items = templates && templates.map((tt, ii) => {
      const label = 'Example ' + (ii + 1);
      return (
        <MenuItem
          eventKey={ii}
          key={label}>
          {label}
        </MenuItem>
      );
    });
    return (
      <DropdownButton
        disabled={!templates || !templates.length}
        id={this._id}
        onSelect={this._onSelect}
        title="Load">
        {items}
      </DropdownButton>
    );
  }

  _onSelect = (eventKey: number): void => {
    if (this._unmounted) {
      return;
    }
    const template = this.state.templates && this.state.templates[eventKey];
    if (template) {
      const editorState = docsConvertFromRawContentState(template);
      this.props.onSelect(editorState);
    }
  };
}

function getScrollTop(): number {
  const el = document && document.documentElement && document.documentElement;
  return (el && el.scrollTop) || 0;
}

function getInitialState(): Object {
  const url = URI.parse(window.location.href);
  const params = queryString.parse(url.query);
  const id = params.id ? params.id : ('d' + Date.now().toString(36));
  const canEdit = !!params.edit;
  const docsContext = new DocsContext({
    canEdit,
    id,
  });

  let data;
  try {
    data = JSON.parse(window.localStorage.getItem(id));
  } catch (ex) {
    data = null;
  }
  const editorState = docsConvertFromRawContentState(data);
  return {
    docsContext,
    editorState,
    // TODO: use `pageKey` to force full page refresh. maybe there is a better
    // way to do this?
    pageKey: Date.now(),
    hideToolbar: false,
  };
}

class GuestDocsPage extends React.PureComponent {
  _editorState = null;
  _eventsCapture = null;
  _id = uniqueID();
  _rafID = 0;
  _scrollTop = getScrollTop();
  _timer = new Timer();

  state = getInitialState();


  componentDidMount(): void {
    this._updateURL();
    this._eventsCapture = captureDocumentEvents({
      scroll: this._onScroll,
      keydown: this._onKeyDown,
    });
  }

  componentWillUnmount(): void {
    this._eventsCapture && this._eventsCapture.dispose();
    this._timer.dispose();
  }

  render(): React.Element<any> {
    const {docsContext, editorState, pageKey, hideToolbar} = this.state;
    const className = cx({
      'docs-demo-page-toolbar': true,
      'docs-demo-page-toolbar-hidden': hideToolbar,
    });
    return (
      <div>
        <div className={className}>
          <ButtonToolbar>
            <ButtonGroup>
              <Button
                onClick={this._createNew}>
                New
              </Button>
              <TemplateDropDown onSelect={this._apply}/>
              <Button
                onClick={this._onDebugClick}>
                Export
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                active={!docsContext.canEdit}
                onClick={this._editOff}>
                Viewing
              </Button>
              <Button
                active={docsContext.canEdit}
                onClick={this._editOn}>
                Editing
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                bsStyle="primary"
                disabled={!docsContext.canEdit}
                onClick={this._saveChange}>
                Save
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <DocsPage
          docsContext={docsContext}
          initialEditorState={editorState}
          key={'p' + pageKey}
          onChange={this._onChange}
        />
      </div>
    );
  }

  _editOff = (): void => {
    const {docsContext} = this.state;
    this.setState(
      {
        docsContext: docsContext.merge({canEdit: false}),
        editorState: this._editorState || this.state.editorState,
        pageKey: Date.now(),
      },
      () => {
        this._saveChange();
        this._updateURL();
      },
    );
  };

  _editOn = (): void => {
    const {docsContext} = this.state;
    this.setState(
      {
        docsContext: docsContext.merge({canEdit: true}),
        pageKey: Date.now(),
      },
      this._updateURL,
    );
  };

  _updateURL = (): void => {
    const url = URI.parse(window.location.href);
    const {docsContext} = this.state;
    browserHistory.replace({
      pathname: url.path,
      query: {
        id: docsContext.id,
        edit: docsContext.canEdit ? '1' : '',
      },
    });
  }

  _apply = (e: EditorState): void => {
    this._editorState = e;
    this.setState({
      editorState: e,
      pageKey: Date.now(),
    });
  };

  _onChange = (e: EditorState): void => {
    this._editorState = e;
  };

  _onScroll = (): void => {
    this._maybeToggleToolbar();
  };

  _onKeyDown = (e: any): void => {
    if (e.keyCode === 83 && e.metaKey) {
      e.preventDefault();
      this._saveChange();
    }
  };

  _onDebugClick = (): void => {
    try {
      this._debug();
    } catch (ex) {
      // pass
    }
  };

  _debug = (): void => {
    const {docsContext} = this.state;
    const w = window.open();
    const editorState = this._editorState || this.state.editorState;
    const doc = w.document;
    const contenState = editorState.getCurrentContent();
    const json = JSON.stringify(convertToRaw(contenState), null, 2);
    const el = document.createElement('div');
    el.appendChild(document.createTextNode(json));
    doc.open();
    doc.write(
      '<!doctype><html><title>EditorState - ',
      docsContext.id,
      '</title><body><pre>',
      el.innerHTML,
      '</pre></body></html>',
    );
    doc.close();
  };

  _createNew = (): void => {
    const url = URI.parse(window.location.href);
    browserHistory.replace({
      pathname: url.path,
      query: {
        id: 'd' + Date.now().toString(36),
        edit: true,
      },
    });
    this.setState(getInitialState());
  };

  _saveChange = (): void => {
    if (!this._editorState) {
      return;
    }
    const {docsContext} = this.state;
    const editorState = this._editorState;
    const contenState = editorState.getCurrentContent();
    try {
      const json = JSON.stringify(convertToRaw(contenState), null, 2);
      window.localStorage.setItem(docsContext.id, json);
    } catch (ex) {
      console.warn(ex);
    }
  };

  _maybeToggleToolbar = (): void => {
    this._timer.clear();
    this._timer.set(this._toggleToolbar);
  };

  _toggleToolbar = (): void => {
    const scrollTop = this._scrollTop;
    const scrollTopNew = getScrollTop();
    this._scrollTop = scrollTopNew;
    let hideToolbar;

    if (scrollTopNew < scrollTop) {
      hideToolbar = false;
    } else if (scrollTopNew > scrollTop) {
      hideToolbar = true;
    } else {
      return;
    }
    if (hideToolbar !== this.state.hideToolbar) {
      this.setState({
        hideToolbar,
      });
    }
  };
}

module.exports = GuestDocsPage;
