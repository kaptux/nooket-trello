"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const antd_1 = require("antd");
const { TextArea } = antd_1.Input;
class NewCardFormTemplate extends React.Component {
    constructor() {
        super(...arguments);
        this.updateField = (field, evt) => {
            this.setState({ [field]: evt.target.value });
        };
        this.handleAdd = () => {
            this.props.onAdd(this.state);
        };
    }
    render() {
        const { onCancel } = this.props;
        return (React.createElement("div", { style: {
                background: 'white',
                borderRadius: 3,
                border: '1px solid #eee',
                borderBottom: '1px solid #ccc',
            } },
            React.createElement("div", { style: { padding: 5, margin: 5 } },
                React.createElement("div", null,
                    React.createElement("div", { style: { marginBottom: 5 } },
                        React.createElement(TextArea, { onChange: evt => this.updateField('title', evt), autosize: true }))),
                React.createElement(antd_1.Button, { type: "primary", size: "small", onClick: this.handleAdd }, "Add"),
                React.createElement(antd_1.Button, { size: "small", onClick: onCancel, style: { marginLeft: 10 } }, "Cancel"))));
    }
}
exports.default = NewCardFormTemplate;
//# sourceMappingURL=NewCardFormTemplate.js.map