// @flow

import DocsActionTypes from './DocsActionTypes';
import DocsEditorRuntime from './DocsEditorRuntime';
import invariant from 'invariant';
import {Record, Set as ImmutableSet} from 'immutable';

type RecordData = {
  allowedActions?: ?(ImmutableSet<string> | Array<string>),
  canEdit?: ?boolean,
  id?: ?string,
  runtime?: ?DocsEditorRuntime,
};

const ALL_ACTIONS = ImmutableSet(Object.keys(DocsActionTypes));

const RecordDefaultData = {
  allowedActions: ALL_ACTIONS,
  canEdit: false,
  id: '',
  runtime: null,
};

class DocsContext extends Record(RecordDefaultData) {
  constructor(data: RecordData) {
    let {id, allowedActions, canEdit, runtime} = data;
    id = id || '';

    if (!ImmutableSet.isSet(allowedActions)) {
      if (Array.isArray(allowedActions)) {
        allowedActions = ImmutableSet(allowedActions);
      } else if (!allowedActions) {
        allowedActions = ALL_ACTIONS;
      } else {
        invariant(false, 'invalid allowedActions %s', allowedActions);
      }
    }

    canEdit = !!canEdit;
    runtime = runtime || null,

    super({
      id,
      canEdit,
      allowedActions,
      runtime,
    });
  }
}

module.exports = DocsContext;
