// @flow

import warn from './warn';

function tryFocus(obj: any, resumeSelection: ?boolean): void {
  if (obj) {
    try {
      obj.focus(resumeSelection);
    } catch (ex) {
      warn(ex);
    }
  }
}

export default tryFocus;
