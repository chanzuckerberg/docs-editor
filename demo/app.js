// @flow

import React from 'react';
import hello from './hello';

class App extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    return (
      <div>
        {hello('flow works')}
      </div>
    );
  }
}

export default App;
