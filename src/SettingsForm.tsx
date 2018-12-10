import * as React from 'react';
import { Divider, Form, Input, Select } from 'antd';
import FieldSelect from './FieldSelect';
import FieldColorInput from './FieldColorInput';
import { FieldTypeEnum, RuleTypeEnum } from 'nooket-common';
import { getDefaultFieldOfType } from './utils';

const FormItem = Form.Item;
const Option = Select.Option;

class SettingsForm extends React.Component<any, any> {
  public render() {
    const { form, category } = this.props;
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
          })(<FieldSelect category={category} />)}
        </FormItem>
        <Divider orientation="left">Optional</Divider>
        <FormItem
          {...formItemLayout}
          label="Assigned field"
          extra="User to wich is assigned the task"
        >
          {getFieldDecorator('assigned', {})(
            <FieldSelect category={category} type={FieldTypeEnum.MENTION} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Hours of work"
          extra="Stimated hours of work"
        >
          {getFieldDecorator('hoursOfWork', {})(
            <FieldSelect category={category} type={FieldTypeEnum.DECIMAL} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Due date field"
          extra="Planed due date"
        >
          {getFieldDecorator('dueDate', {})(
            <FieldSelect category={category} type={FieldTypeEnum.DATE} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Color field"
          extra="Colored the card in base a field values"
        >
          {getFieldDecorator('colorFieldMapping', {})(
            <FieldColorInput category={category} type={FieldTypeEnum.STRING} />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields: (props: any) => {
    const {
      category,
      laneId,
      assigned,
      hoursOfWork,
      dueDate,
      colorFieldMapping,
    } = props;
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
      colorFieldMapping: Form.createFormField({ value: colorFieldMapping }),
    };
  },
})(SettingsForm);
