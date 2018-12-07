import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { IViewPluginProps } from 'nooket-common';
import NooketTrello from '../src/NooketTrello';

import { context } from './test-data/context';
import { instances } from './test-data/instances';

import 'antd/dist/antd.min.css';

const propsNoSettings: IViewPluginProps = {
  view: {
    type: '',
    query: { categoryId: '2' },
    state: null,
    settings: null,
  },
  context,
  data: instances,
  onRequestEditorView: action('onRequestEditorView'),
  onRequestInstanceView: action('onRequestInstanceView'),
  onSaveInstance: action('onSaveInstance'),
  onSaveState: action('onSaveState'),
  onSaveSettings: action('onSaveSetings'),
};

const props: IViewPluginProps = {
  view: {
    type: '',
    query: { categoryId: '2' },
    state: undefined,
    settings: {
      assigned: 'assignedTo',
      laneId: 'status',
      dueDate: 'releaseDate',
      hoursOfWork: 'time',
    },
  },
  context,
  data: instances,
  onRequestEditorView: action('onRequestEditorView'),
  onRequestInstanceView: action('onRequestInstanceView'),
  onSaveInstance: action('onSaveInstance'),
  onSaveState: action('onSaveState'),
  onSaveSettings: action('onSaveSetings'),
};

storiesOf('NooketTrello', module)
  .add('no-settings', () => <NooketTrello {...propsNoSettings} />)
  .add('default', () => <NooketTrello {...props} />);
