import * as React from 'react';
import { FieldTypeEnum, RuleTypeEnum, ICategory } from 'nooket-common';
import { getFieldsOfType } from './utils';
import { Select } from 'antd';

const Option = Select.Option;

export interface IFieldSelectProps {
  category: ICategory;
  type?: FieldTypeEnum;
  rule?: RuleTypeEnum;
  value?: any;
  onChange?: (
    value: any,
    option: React.ReactElement<any> | React.ReactElement<any>[]
  ) => void;
  style?: any;
}

export default class FieldsSelect extends React.Component<
  IFieldSelectProps,
  any
> {
  public render() {
    const { category, type, rule, value, onChange, style } = this.props;
    const fields = getFieldsOfType(category, type, rule);

    return (
      <Select value={value} onChange={onChange} style={style}>
        {fields.map(f => (
          <Option key={f.code} value={f.code}>
            {f.name}
          </Option>
        ))}
      </Select>
    );
  }
}
