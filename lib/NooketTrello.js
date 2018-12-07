"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const antd_1 = require("antd");
const nooket_common_1 = require("nooket-common");
const SettingsForm_1 = require("./SettingsForm");
const NewCardFormTemplate_1 = require("./NewCardFormTemplate");
const CardTemplate_1 = require("./CardTemplate");
const utils_1 = require("./utils");
const react_trello_1 = require("react-trello");
const MAX_ORDER = 9999999;
const NO_ASSIGNED_ID = '00001';
const NooketTrelloContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  height: 100vh;

  .head {
    display: flex;
    text-align: right;
    height: 32px;

    .quick-filters {
      flex: 1;
      text-align: left;
    }

    .toolbox {
      width: 60px;
    }
  }
  .boardContainer {
    background-color: #fff;

    section {
      max-height: 95vh;
    }
  }
  .draggingCard {
    background-color: #7fffd4;
    border: 1px dashed #a5916c;
    transform: rotate(2deg);
  }

  .draggingLane {
    background-color: #ffaecf;
    transform: rotate(2deg);
    border: 1px dashed #a5916c;
  }
  .smooth-dnd-draggable-wrapper {
    section {
      padding-top: 5px;
      padding-left: 5px;
      padding-right: 0px;
      div {
        margin-right: 3px;
      }
      div::-webkit-scrollbar {
        width: 5px;
        background-color: #eee;
      }
    }
  }
  .card {
    padding: 5px 10px;
    font-size: 14px;
    color: rgb(23, 57, 77);
    position: relative;

    .tagContainer {
      .tag {
        font-size: 12px;
        font-weight: 400;
        color: #6b808c;
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        position: relative;
        text-decoration: none;
        text-overflow: ellipsis;
        margin-top: 4px;
      }
    }
    .user {
      position: absolute;
      bottom: 10px;
      right: 5px;
      width: 24px;
      height: 24px;
    }
  }
`;
class NooketTrello extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            showSettingDialog: false,
            assignedFilter: undefined,
            colorFilter: undefined,
        };
        this.handleSaveSettings = () => {
            const { onSaveSettings } = this.props;
            const { props: { form }, } = this.settingsForm;
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                onSaveSettings(values, () => this.setState({ showSettingDialog: false }));
            });
        };
        this.handleBoardChange = (boardState) => {
            const { onSaveState } = this.props;
            const instanceOrder = {};
            const laneOrder = {};
            boardState.lanes.forEach((l, i) => {
                laneOrder[l.id] = i;
                l.cards.forEach((c, j) => {
                    instanceOrder[c.id] = j;
                });
            });
            onSaveState({ instanceOrder, laneOrder });
        };
        this.handleCancelSettings = () => {
            this.setState({ showSettingDialog: false });
        };
        this.handleSettingClick = () => {
            this.setState({ showSettingDialog: true });
        };
        this.handleFilterChange = (filter, value) => {
            this.setState({ [filter]: value });
        };
        this.setSettingsFormInstance = formRef => {
            this.settingsForm = formRef;
        };
        this.checkFilter = (cardValue, filter) => {
            return !filter || filter === cardValue;
        };
        this.createLanesHashmap = (category, field, laneOrder) => {
            const res = {};
            const fieldInfo = category.fields.find(f => f.code === field);
            const allowedValues = fieldInfo.rules.find(r => r.rule === nooket_common_1.RuleTypeEnum.ALLOWED_VALUES);
            if (allowedValues) {
                let values = allowedValues.value;
                if (typeof values === 'string') {
                    values = values.split(',').map(v => v.trim());
                }
                values.forEach(v => {
                    res[v] = {
                        id: v,
                        title: v,
                        cards: [],
                        order: laneOrder[v] || MAX_ORDER,
                    };
                });
            }
            return res;
        };
    }
    getData() {
        const { view, context, data } = this.props;
        const { assignedFilter, colorFilter } = this.state;
        const { state = {}, settings, query } = view;
        const { usersHashmap, categoriesHashmap } = context;
        const { instanceOrder = {}, laneOrder = {} } = state;
        const category = categoriesHashmap[query.categoryId];
        const lanesHashmap = this.createLanesHashmap(category, settings.laneId, laneOrder);
        const cardUsersHashmap = {};
        data.forEach(instance => {
            const card = utils_1.instanceMapping(settings, instance);
            card.title = instance.title;
            card.id = instance._id;
            card.order = instanceOrder[card.id] || MAX_ORDER;
            if (card.assigned) {
                const user = usersHashmap[card.assigned];
                card.assignedUser = user;
                cardUsersHashmap[user.login] = user;
            }
            else if (!cardUsersHashmap[NO_ASSIGNED_ID]) {
                cardUsersHashmap[NO_ASSIGNED_ID] = {
                    _id: NO_ASSIGNED_ID,
                    login: '',
                    name: 'No assigned',
                    avatar: '',
                };
            }
            card.noFiltered = this.checkFilter(card.assigned || NO_ASSIGNED_ID, assignedFilter);
            const lane = lanesHashmap[card.laneId] ||
                {
                    id: card.laneId,
                    title: card.laneId,
                    cards: [],
                    order: laneOrder[card.laneId] || MAX_ORDER,
                };
            lane.cards.push(card);
            lanesHashmap[card.laneId] = lane;
        });
        const lanes = Object.values(lanesHashmap).sort(utils_1.sortByOrder);
        lanes.forEach(l => {
            l.cards = l.cards.filter(c => c.noFiltered).sort(utils_1.sortByOrder);
        });
        return {
            lanes: Object.values(lanesHashmap),
            totalCards: 0,
            users: Object.values(cardUsersHashmap),
        };
    }
    render() {
        const { view, context } = this.props;
        const { categoriesHashmap } = context;
        const { settings, state, query } = view;
        const { showSettingDialog, assignedFilter, colorFilter } = this.state;
        const category = categoriesHashmap[query.categoryId];
        let data = {};
        if (settings) {
            data = this.getData();
        }
        return (React.createElement(NooketTrelloContainer, null,
            settings && (React.createElement("div", { className: "head" },
                React.createElement("div", { className: "quick-filters" },
                    React.createElement(antd_1.Select, { value: assignedFilter, showSearch: true, style: { width: 200 }, allowClear: true, placeholder: "Assigned to", onChange: value => {
                            this.handleFilterChange('assignedFilter', value);
                        } }, data.users.map(user => (React.createElement(antd_1.Select.Option, { key: user._id, value: user._id },
                        React.createElement(antd_1.Avatar, { size: "small", src: user.avatar }),
                        "\u00A0\u00A0",
                        user.name)))),
                    React.createElement(antd_1.Select, { showSearch: true, style: { width: 200, marginLeft: 10 }, placeholder: "Color" })),
                React.createElement("div", { className: "toolbox" },
                    React.createElement(antd_1.Button, { icon: "setting", onClick: this.handleSettingClick })))),
            settings && (React.createElement(react_trello_1.default, { data: data, draggable: true, hideCardDeleteIcon: true, onDataChange: this.handleBoardChange, newCardTemplate: React.createElement(NewCardFormTemplate_1.default, null), customCardLayout: true, className: "boardContainer" },
                React.createElement(CardTemplate_1.default, null))),
            React.createElement(antd_1.Modal, { visible: showSettingDialog || !view.settings, title: "Settings", onOk: this.handleSaveSettings, onCancel: this.handleCancelSettings, cancelButtonProps: { disabled: !view.settings } },
                React.createElement(SettingsForm_1.default, Object.assign({ wrappedComponentRef: this.setSettingsFormInstance, category: category }, settings || {})))));
    }
}
exports.default = NooketTrello;
//# sourceMappingURL=NooketTrello.js.map