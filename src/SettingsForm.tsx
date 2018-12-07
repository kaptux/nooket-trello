import { Divider, Form, Input, Select } from 'antd';
import { FieldTypeEnum, ICategory } from 'nooket-common';
import * as React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

function getFieldsOfType(category: ICategory, type?: FieldTypeEnum) {
  let fields = category.fields;
  if (type) {
    fields = category.fields.filter(f => f.type === type);
  }
  return fields;
}

function getDefaultFieldOfType(category: ICategory, type?: FieldTypeEnum) {
  let res;
  const fields = getFieldsOfType(category, type);
  if (fields.length > 0) {
    res = fields[0].code;
  }
  return res;
}

class SettingsForm extends React.Component<any, any> {
  private getFieldsSelect(type?: FieldTypeEnum) {
    const { category } = this.props;

    const fields = getFieldsOfType(category, type);

    let firstValue;
    if (fields.length > 0) {
      firstValue = fields[0].code;
    }

    return (
      <Select>
        {fields.map(f => (
          <Option key={f.code} value={f.code}>
            {f.name}
          </Option>
        ))}
      </Select>
    );
  }

  public render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
        xs: { span: 24 },
      },
      wrapperCol: {
        sm: { span: 18 },
        xs: { span: 24 },
      },
    };

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="Column field"
          extra="Wich field will be used to generate the kanban columns"
        >
          {getFieldDecorator('laneId', {
            rules: [{ required: true, message: 'A field is required' }],
          })(this.getFieldsSelect())}
        </FormItem>
        <Divider orientation="left">Optional</Divider>
        <FormItem
          {...formItemLayout}
          label="Assigned field"
          extra="User to wich is assigned the task"
        >
          {getFieldDecorator('assigned', {})(
            this.getFieldsSelect(FieldTypeEnum.MENTION)
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Hours of work"
          extra="Stimated hours of work"
        >
          {getFieldDecorator('hoursOfWork', {})(
            this.getFieldsSelect(FieldTypeEnum.DECIMAL)
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Due date field"
          extra="Planed due date"
        >
          {getFieldDecorator('dueDate', {})(
            this.getFieldsSelect(FieldTypeEnum.DATE)
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields: (props: any) => {
    const { category, laneId, assigned, hoursOfWork, dueDate } = props;
    return {
      laneId: Form.createFormField({
        value: laneId,
      }),
      assigned: Form.createFormField({
        value:
          assigned || getDefaultFieldOfType(category, FieldTypeEnum.MENTION),
      }),
      hoursOfWork: Form.createFormField({
        value:
          hoursOfWork || getDefaultFieldOfType(category, FieldTypeEnum.DECIMAL),
      }),
      dueDate: Form.createFormField({
        value: dueDate || getDefaultFieldOfType(category, FieldTypeEnum.DATE),
      }),
    };
  },
})(SettingsForm);
