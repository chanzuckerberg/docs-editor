// @flow

import DocsDropdownButton from './DocsDropdownButton';
import DocsMenuItem from './DocsMenuItem';
import React from 'react';
import updateEntityData from './updateEntityData';
import {EditorState} from 'draft-js';

import type {DocsEditorLike} from './Types';

type Option = {
  action?: ?string,
  activeName?: ?string,
  icon?: ?string,
  label?: string,
  modifier?: (e: EditorState, ...any) => EditorState,
};

type Props = {
  editorState: EditorState,
  entity: Object,
  entityKey: string,
  getEditor: () => ?DocsEditorLike,
  onChange: (e: EditorState) => void,
  options: Array<?Option>,
  title: string,
};

class DocsTableMenu extends React.PureComponent {

  _mouseDownTarget = null;

  props: Props;

  render(): React.Element<any> {
    const {entity, options, title} = this.props;
    const entityData = entity.getData();
    let kk = 0;
    const items = options.map((option: ?Object, index) => {
      if (!option) {
        return <DocsMenuItem divider key={'divider-' + (kk++)} />;
      }
      const {activeName, icon, label} = option;
      const active = activeName && !!entityData[activeName];
      return (
        <DocsMenuItem
          active={active}
          icon={icon}
          key={option.action}
          label={label}
          onClick={this._onMenuItemClick}
          value={option}
        />
      );
    });

    return (
      <DocsDropdownButton title={title + '\u2026'}>
        {items}
      </DocsDropdownButton>
    );
  }

  _onMenuItemClick = (option: Object) => {
    this._onAction(option);
  };

  _onAction(option: Object): void {
    const {modifier, action} = option;
    const {getEditor, entityKey, entity, editorState, onChange} = this.props;
    const editor = getEditor();
    if (!editor) {
      return;
    }
    const editorProps: Object = editor.props;
    let {rowIndex, cellIndex, id} = editorProps;
    if (rowIndex === undefined || cellIndex === undefined) {
      return;
    }
    const entityData = entity.getData();
    const newEntityData = modifier(entityData, rowIndex, cellIndex);
    onChange(updateEntityData(editorState, entityKey, newEntityData));
  }
}


module.exports = DocsTableMenu;
