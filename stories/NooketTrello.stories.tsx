import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { IViewPluginProps } from 'nooket-common';
import NooketTrello from '../src/NooketTrello';
import StoryContainer from './StoryContainer';

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
    state: {
      instanceOrder: undefined,
      laneOrder: {
        blocked: 1,
        pending: 2,
        'in progress': 3,
        completed: 4,
      },
    },
    settings: {
      assigned: 'assignedTo',
      laneId: 'status',
      dueDate: 'releaseDate',
      hoursOfWork: 'time',
      colorFieldMapping: {
        fieldCode: 'priority',
        colorMapping: [
          {
            color: '#f2d600',
            fieldValue: 'low',
          },
          {
            color: '#ff9f1a',
            fieldValue: 'normal',
          },
          {
            color: '#eb5a46',
            fieldValue: 'hight',
          },
        ],
      },
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
  .add('default', () => (
    <StoryContainer>
      <NooketTrello {...props} />
    </StoryContainer>
  ));
