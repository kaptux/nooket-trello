import * as React from 'react';

import { IViewPluginProps } from 'nooket-common';

export default class HelloWorld extends React.Component<IViewPluginProps, any> {
  public render() {
    return <div style={{ color: this.props.context.userId }}>Hello world!</div>;
  }
}
