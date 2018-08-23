// @flow

import ReactDOM from 'react-dom';
import warn from './warn';

function tryFindDOMNode(component: any): ?Node {
  try {
    return ReactDOM.findDOMNode(component);
  } catch (ex) {
    warn(ex);
    return null;
  }
}

export default tryFindDOMNode;
