"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const antd_1 = require("antd");
const nooket_common_1 = require("nooket-common");
const React = require("react");
const FormItem = antd_1.Form.Item;
const Option = antd_1.Select.Option;
function getFieldsOfType(category, type) {
    let fields = category.fields;
    if (type) {
        fields = category.fields.filter(f => f.type === type);
    }
    return fields;
}
function getDefaultFieldOfType(category, type) {
    let res;
    const fields = getFieldsOfType(category, type);
    if (fields.length > 0) {
        res = fields[0].code;
    }
    return res;
}
class SettingsForm extends React.Component {
    getFieldsSelect(type) {
        const { category } = this.props;
        const fields = getFieldsOfType(category, type);
        let firstValue;
        if (fields.length > 0) {
            firstValue = fields[0].code;
        }
        return (React.createElement(antd_1.Select, null, fields.map(f => (React.createElement(Option, { key: f.code, value: f.code }, f.name)))));
    }
    render() {
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
        return (React.createElement(antd_1.Form, null,
            React.createElement(FormItem, Object.assign({}, formItemLayout, { label: "Column field", extra: "Wich field will be used to generate the kanban columns" }), getFieldDecorator('laneId', {
                rules: [{ required: true, message: 'A field is required' }],
            })(this.getFieldsSelect())),
            React.createElement(antd_1.Divider, { orientation: "left" }, "Optional"),
            React.createElement(FormItem, Object.assign({}, formItemLayout, { label: "Assigned field", extra: "User to wich is assigned the task" }), getFieldDecorator('assigned', {})(this.getFieldsSelect(nooket_common_1.FieldTypeEnum.MENTION))),
            React.createElement(FormItem, Object.assign({}, formItemLayout, { label: "Hours of work", extra: "Stimated hours of work" }), getFieldDecorator('hoursOfWork', {})(this.getFieldsSelect(nooket_common_1.FieldTypeEnum.DECIMAL))),
            React.createElement(FormItem, Object.assign({}, formItemLayout, { label: "Due date field", extra: "Planed due date" }), getFieldDecorator('dueDate', {})(this.getFieldsSelect(nooket_common_1.FieldTypeEnum.DATE)))));
    }
}
exports.default = antd_1.Form.create({
    mapPropsToFields: (props) => {
        const { category, laneId, assigned, hoursOfWork, dueDate } = props;
        return {
            laneId: antd_1.Form.createFormField({
                value: laneId,
            }),
            assigned: antd_1.Form.createFormField({
                value: assigned || getDefaultFieldOfType(category, nooket_common_1.FieldTypeEnum.MENTION),
            }),
            hoursOfWork: antd_1.Form.createFormField({
                value: hoursOfWork || getDefaultFieldOfType(category, nooket_common_1.FieldTypeEnum.DECIMAL),
            }),
            dueDate: antd_1.Form.createFormField({
                value: dueDate || getDefaultFieldOfType(category, nooket_common_1.FieldTypeEnum.DATE),
            }),
        };
    },
})(SettingsForm);
//# sourceMappingURL=SettingsForm.js.map