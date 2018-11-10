import * as React from 'react';

export interface IHelloWorldProps {
  color: string;
}

export default class HelloWorld extends React.Component<IHelloWorldProps, any> {
  public render() {
    return <div style={{ color: this.props.color }}>Hello world!</div>;
  }
}
