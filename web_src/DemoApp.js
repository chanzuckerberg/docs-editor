// @flow

import React from 'react';

import {ButtonGroup, Button} from 'react-bootstrap';
import {DocsEditor, DocsContext, EditorState, convertToRaw, convertFromRaw, convertFromHTML, uniqueID} from '../src/index.js';

// Because React-Bootstrap doesn't depend on a very precise version of
// Bootstrap, we don't ship with any included css. However, some stylesheet is
// required to use these components. How and which bootstrap styles you
// include is up to you, but the simplest way is to include the latest styles
// from the CDN.
// `npm install bootstrap-css@3.3.7`
import '../node_modules/bootstrap-css/lib/alerts.css';
import '../node_modules/bootstrap-css/lib/badges.css';
import '../node_modules/bootstrap-css/lib/breadcrumbs.css';
import '../node_modules/bootstrap-css/lib/button-groups.css';
import '../node_modules/bootstrap-css/lib/buttons.css';
import '../node_modules/bootstrap-css/lib/carousel.css';
import '../node_modules/bootstrap-css/lib/close.css';
import '../node_modules/bootstrap-css/lib/code.css';
import '../node_modules/bootstrap-css/lib/component-animations.css';
import '../node_modules/bootstrap-css/lib/dropdowns.css';
import '../node_modules/bootstrap-css/lib/forms.css';
import '../node_modules/bootstrap-css/lib/grid.css';
import '../node_modules/bootstrap-css/lib/input-groups.css';
import '../node_modules/bootstrap-css/lib/jumbotron.css';
import '../node_modules/bootstrap-css/lib/labels.css';
import '../node_modules/bootstrap-css/lib/list-group.css';
import '../node_modules/bootstrap-css/lib/media.css';
import '../node_modules/bootstrap-css/lib/modals.css';
import '../node_modules/bootstrap-css/lib/navbar.css';
import '../node_modules/bootstrap-css/lib/navs.css';
import '../node_modules/bootstrap-css/lib/normalize.css';
import '../node_modules/bootstrap-css/lib/pager.css';
import '../node_modules/bootstrap-css/lib/pagination.css';
import '../node_modules/bootstrap-css/lib/panels.css';
import '../node_modules/bootstrap-css/lib/popovers.css';
import '../node_modules/bootstrap-css/lib/print.css';
import '../node_modules/bootstrap-css/lib/progress-bars.css';
import '../node_modules/bootstrap-css/lib/responsive-embed.css';
import '../node_modules/bootstrap-css/lib/responsive-utilities.css';
import '../node_modules/bootstrap-css/lib/scaffolding.css';
import '../node_modules/bootstrap-css/lib/tables.css';
import '../node_modules/bootstrap-css/lib/thumbnails.css';
import '../node_modules/bootstrap-css/lib/tooltip.css';
import '../node_modules/bootstrap-css/lib/type.css';
import '../node_modules/bootstrap-css/lib/utilities.css';
import '../node_modules/bootstrap-css/lib/wells.css';

// `npm install draft-js@0.10.0`
import '../node_modules/draft-js/dist/Draft.css';

// `npm install bootswatch@3.3.4`
import "../node_modules/bootswatch/cerulean/bootstrap.min.css";

import './DemoApp.css';

const DEFAULT_CONTEXT = new DocsContext({});
const DEFAULT_EDITOR_STATE = convertFromRaw({});
const LOCAL_STORAGE_KEY = 'education-doc-editor-examples';

function getInitialState(): Object {
  const docsContext = DEFAULT_CONTEXT.merge({canEdit: true});
  let editorState;
  let json = '';
  try {
    json = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const raw = JSON.parse(json);
    editorState = convertFromRaw(raw);
  } catch (ex) {
    editorState = DEFAULT_EDITOR_STATE;
  }
  return {
    debugKey: uniqueID(),
    docsContext,
    editorState,
    initialEditorState: editorState,
    json,
  };
}

function noop(): void {

}

class DemoApp extends React.PureComponent<any, any, any> {
  state = getInitialState();

  render(): React.Element<any> {
    const {docsContext, editorState, json, debugKey} = this.state;
    return (
      <div id="app">
        <div className="main-column">
          <DocsEditor
            docsContext={docsContext}
            editorState={editorState}
            height="100%"
            width="100%"
            onChange={this._onChange}
          />
        </div>
        <div className="side-column">
          <div>
            <ButtonGroup>
              <Button onClick={this._save} bsStyle="primary">Save</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button onClick={this._dump}>Dump</Button>
              <Button onClick={this._clear}>Clear</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button onClick={this._importJSON}>Import JSON</Button>
              <Button onClick={this._importHTML}>Import HTML</Button>
              <Button onClick={this._reset}>Reset</Button>
            </ButtonGroup>
          </div>
          <textarea
            defaultValue={json}
            id={debugKey}
            key={debugKey}
          />
        </div>
      </div>
    );
  }

  _onChange = (editorState: Object): void => {
    this.setState({editorState});
  };

  _importHTML = (): void => {
    const {debugKey, editorState} = this.state;
    const el:any = document.getElementById(debugKey);
    if (!el) {
      return;
    }
    this.setState({
      editorState: convertFromHTML(el.value, editorState),
    });
  };

  _importJSON = (): void => {
    const {debugKey, editorState} = this.state;
    const el:any = document.getElementById(debugKey);
    if (el) {
      try {
        const json = el.value.trim();
        const raw = JSON.parse(json);
        this.setState({editorState: convertFromRaw(raw, editorState)});
      } catch (ex) {
        el.value = ex.message;
      }
    }
  };

  _reset = (): void => {
    const {initialEditorState} = this.state;
    this.setState({
      editorState: initialEditorState,
    });
  }

  _dump = (callback?: ?Function): void => {
    const {editorState} = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    const json = JSON.stringify(raw, null, 2);
    const fn = typeof callback === 'function' ? callback : noop;
    this.setState({
      json,
      debugKey: uniqueID(),
    }, fn);
  };

  _save = (): void => {
    this._dump(() => {
      const {json} = this.state;
      window.localStorage.setItem(LOCAL_STORAGE_KEY, json);
    });
  };

  _clear = (): void => {
    this.setState({json: '', debugKey: uniqueID()});
    window.localStorage.clear();
  };
}

export default DemoApp;
