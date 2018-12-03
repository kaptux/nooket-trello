import * as React from 'react';

import { storiesOf } from '@storybook/react';
import HelloWorld from '../src/HelloWorld';

storiesOf('HelloWorld', module)
  .add('default-blue', () => <HelloWorld color="blue" />)
  .add('default-green', () => <HelloWorld color="green" />)
  .add('default-red', () => <HelloWorld color="red" />);
