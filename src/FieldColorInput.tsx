import * as React from 'react';
import styled from 'styled-components';
import { Select, Button, Icon } from 'antd';
import FieldSelect from './FieldSelect';
import { ICategory, FieldTypeEnum, RuleTypeEnum } from 'nooket-common';

export interface IMapping {
  color: String;
  fieldValue: String;
}
export interface IValueType {
  fieldCode: String;
  colorMapping: IMapping[];
}
export interface FieldColorInputProps {
  category: ICategory;
  type?: FieldTypeEnum;
  rule?: RuleTypeEnum;
  value?: IValueType;
  onChange?: Function;
}

const colors = [
  '#61bd4f',
  '#f2d600',
  '#ff9f1a',
  '#eb5a46',
  '#c377e0',
  '#0079bf',
  '#00c2e0',
  '#51e898',
  '#ff78cb',
  '#355263',
];

const FieldColorInputContainer = styled.div`
  display: flex;
  margin-top: 10px;

  .color-select {
    width: 70px;
  }
  .field-select {
    flex: 1;
  }
  .action {
    width: 30px;
  }
  .color {
    width: 30px;
    height: 15px;
    display: block-inline;
    margin-top: 7px;
  }
`;

class FieldColorInput extends React.Component<FieldColorInputProps, any> {
  state = {
    color: undefined,
    fieldValue: undefined,
  };
  public static defaultProps = {
    onChange: () => true,
  };
  private handelSelectField = fieldCode => {
    const { onChange } = this.props;
    onChange({ fieldCode, colorMapping: [] });
  };
  private handelSelectColor = color => {
    this.setState({ color });
  };
  private handelSelectFieldValue = fieldValue => {
    this.setState({ fieldValue });
  };
  private handleAddNewMapping = () => {
    const { onChange, value } = this.props;
    const { color, fieldValue } = this.state;

    const newValue = { ...value };
    newValue.colorMapping = [...value.colorMapping, { color, fieldValue }];
    this.setState({ color: undefined, fieldValue: undefined });
    onChange(newValue);
  };
  private handleDeleteMapping = color => {
    const { value = {} as IValueType, onChange } = this.props;
    const newValue = { ...value };
    newValue.colorMapping = newValue.colorMapping.filter(
      m => m.color !== color
    );
    onChange(newValue);
  };
  private getColorMappingSelect(mappings, posibleValues) {
    const { color, fieldValue } = this.state;
    const usedColors = [];
    const usedFields = [];

    mappings.forEach(m => {
      usedColors.push(m.color);
      usedFields.push(m.fieldValue);
    });

    const colorsAllowed = colors.filter(c => usedColors.indexOf(c) < 0);
    const valuesAllowed = posibleValues.filter(v => usedFields.indexOf(v) < 0);

    return (
      <FieldColorInputContainer>
        <div className="color-select">
          <Select
            value={color}
            onChange={this.handelSelectColor}
            style={{ width: '100%' }}
          >
            {colorsAllowed.map(c => (
              <Select.Option key={c} value={c}>
                <div className="color" style={{ backgroundColor: c }}>
                  &nbsp;
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="field-select">
          <Select
            value={fieldValue}
            onChange={this.handelSelectFieldValue}
            style={{ width: '100%' }}
          >
            {valuesAllowed.map(v => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="action">
          <Button
            icon="plus"
            disabled={!color || !fieldValue}
            onClick={this.handleAddNewMapping}
          />
        </div>
      </FieldColorInputContainer>
    );
  }
  private getColorMappingValue({ fieldValue, color }) {
    return (
      <FieldColorInputContainer>
        <div className="color-select">
          <div
            className="color"
            style={{ backgroundColor: color, marginLeft: 10, marginTop: 13 }}
          />
        </div>
        <div className="field-select">{fieldValue}</div>
        <div className="action">
          <Icon type="close" onClick={() => this.handleDeleteMapping(color)} />
        </div>
      </FieldColorInputContainer>
    );
  }
  render() {
    const { category, type, rule, value = {} as IValueType } = this.props;
    const { fieldCode, colorMapping = [] } = value;

    let fieldValues = [];
    if (fieldCode) {
      const field = category.fields.find(f => f.code === fieldCode);
      const allowedValuesRule = field.rules.find(
        r => r.rule === RuleTypeEnum.ALLOWED_VALUES
      );
      if (allowedValuesRule) {
        fieldValues = allowedValuesRule.value.split(',').map(v => v.trim());
      }
    }

    return (
      <React.Fragment>
        <FieldSelect
          category={category}
          type={type}
          rule={rule}
          value={fieldCode}
          onChange={this.handelSelectField}
          style={{ width: '100%' }}
        />
        {fieldCode && (
          <React.Fragment>
            {colorMapping.map(m => this.getColorMappingValue(m))}
            {this.getColorMappingSelect(colorMapping, fieldValues)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default FieldColorInput;
