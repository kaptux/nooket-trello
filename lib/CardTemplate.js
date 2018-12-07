"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const antd_1 = require("antd");
const moment = require("moment");
function CardTemplate({ title, dueDate, assignedUser, hoursOfWork, }) {
    return (React.createElement("div", { className: "card" },
        React.createElement("div", null, title),
        React.createElement("div", { className: "tagContainer" }, dueDate && (React.createElement("div", { className: "tag" },
            React.createElement(antd_1.Icon, { type: "clock-circle" }),
            "\u00A0",
            moment(dueDate).format('D MMM.')))),
        assignedUser && (React.createElement("div", { className: "user" },
            React.createElement(antd_1.Tooltip, { title: assignedUser.name },
                React.createElement(antd_1.Avatar, { src: assignedUser.avatar }))))));
}
exports.default = CardTemplate;
//# sourceMappingURL=CardTemplate.js.map