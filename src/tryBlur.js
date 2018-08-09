// @flow

import warn from './warn';

function tryBlur(obj: any): void {
  if (obj && typeof obj.blur === 'function') {
    try {
      obj.blur();
    } catch (ex) {
      warn(ex);
    }
  }
}

export default tryBlur;
