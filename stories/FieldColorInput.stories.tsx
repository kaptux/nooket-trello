import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
  IViewPluginProps,
  FieldTypeEnum,
  RuleTypeEnum,
  ICategory,
} from 'nooket-common';
import FieldColorInput from '../src/FieldColorInput';

import { categories } from './test-data/categories';

import 'antd/dist/antd.min.css';

const taskCategory = categories[2] as ICategory;

storiesOf('FieldColorInput', module)
  .add('default', () => (
    <FieldColorInput
      category={taskCategory}
      type={FieldTypeEnum.STRING}
      onChange={action('onChange')}
    />
  ))
  .add('with-value', () => (
    <FieldColorInput
      category={taskCategory}
      type={FieldTypeEnum.STRING}
      value={{
        fieldCode: 'status',
        colorMapping: [
          { color: '#ccc', fieldValue: 'in progress' },
          { color: '#eee', fieldValue: 'pending' },
        ],
      }}
      onChange={action('onChange')}
    />
  ));
