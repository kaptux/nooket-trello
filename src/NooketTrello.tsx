import * as React from 'react';
import styled from 'styled-components';
import { Button, Modal, Select, Avatar } from 'antd';
import {
  IViewPluginProps,
  IUser,
  ICategory,
  RuleTypeEnum,
  InstanceViewModeEnum,
} from 'nooket-common';
import SettingsForm from './SettingsForm';
import NewCardFormTemplate from './NewCardFormTemplate';
import CardTemplate from './CardTemplate';
import { instanceMapping, sortByOrder, arrayOfObjectsToHashmap } from './utils';
import { IBoardData, ICard, ILane, IColorMapping } from './types';

import Board from 'react-trello';

const MAX_ORDER = 9999999;
const NO_ASSIGNED_ID = '00001';

const NooketTrelloContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .head {
    display: flex;
    text-align: right;
    height: 32px;
    margin: 16px 16px 0 16px;

    .quick-filters {
      flex: 1;
      text-align: left;
    }

    .toolbox {
      width: 60px;
    }
  }
  .boardContainer {
    padding: 5px 0px;
    background-color: #fff;
    flex: 1;

    header {
      span {
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        width: 70%;
      }
    }
  }
  .boardContainer::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background-color: #eee;
  }
  .boardContainer::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 5px;
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
  .smooth-dnd-container {
    height: 100%;
  }
  .smooth-dnd-draggable-wrapper {
    section {
      max-height: 99%;
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
      div::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 5px;
      }
    }
  }
  .horizontal > .smooth-dnd-draggable-wrapper:first-child {
    padding-left: 11px;
  }
  .card {
    padding: 5px 10px;
    font-size: 14px;
    color: rgb(23, 57, 77);
    position: relative;

    .color {
      width: 40px;
      height: 8px;
      border-radius: 4px;
      margin-bottom: 4px;
    }

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

class NooketTrello extends React.Component<IViewPluginProps, any> {
  public state = {
    showSettingDialog: false,
    assignedFilter: undefined,
    colorFilter: undefined,
    instanceView: undefined,
  };
  private settingsForm;
  private reRenderBoard = true;
  private lastBoardRender;

  private handleSaveSettings = () => {
    const { onSaveSettings } = this.props;
    const {
      props: { form },
    } = this.settingsForm;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      onSaveSettings(values, () => this.setState({ showSettingDialog: false }));
    });
  };
  private handleCancelSettings = () => {
    this.setState({ showSettingDialog: false });
    this.reRenderBoard = false;
  };
  private handleSettingClick = () => {
    this.setState({ showSettingDialog: true });
    this.reRenderBoard = false;
  };
  private handleFilterChange = (filter, value) => {
    this.setState({ [filter]: value });
  };
  private handleCardClick = cardId => {
    const { onRequestInstanceView } = this.props;
    const instanceView = onRequestInstanceView(
      InstanceViewModeEnum.FULLSCREEN,
      cardId
    );
    this.setState({ instanceView });
    this.reRenderBoard = false;
  };
  private handleDataChange = boardState => {
    const { onSaveState } = this.props;
    const instanceOrder = {};
    const laneOrder = {};

    // Avoid index 0
    boardState.lanes.forEach((l, i) => {
      laneOrder[l.id] = i + 1;
      l.cards.forEach((c, j) => {
        instanceOrder[c.id] = j + 1;
      });
    });

    this.reRenderBoard = false;
    onSaveState({ laneOrder, instanceOrder });
  };
  private handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    if (sourceLaneId !== targetLaneId) {
      const {
        onSaveInstance,
        context,
        view: { settings },
      } = this.props;

      const fieldToUpdate = settings.laneId;
      const instance = {
        _id: cardDetails.id,
        fields: [{ code: fieldToUpdate, value: targetLaneId }],
      };

      onSaveInstance(context.userId, instance);
      this.reRenderBoard = false;
    }
  };
  private setSettingsFormInstance = formRef => {
    this.settingsForm = formRef;
  };
  private checkFilter = (cardValue: string, filter): boolean => {
    return !filter || filter === cardValue;
  };
  private createLanesHashmap = (
    category: ICategory,
    field: string,
    laneOrder: any
  ): { [id: string]: ILane } => {
    const res: { [id: string]: ILane } = {};

    const fieldInfo = category.fields.find(f => f.code === field);
    const allowedValues = fieldInfo.rules.find(
      r => r.rule === RuleTypeEnum.ALLOWED_VALUES
    );

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
        } as ILane;
      });
    }

    return res;
  };

  private getData(): IBoardData {
    const { view, context, data } = this.props;
    const { assignedFilter, colorFilter } = this.state;
    const { state = {}, settings, query } = view;
    const { usersHashmap, categoriesHashmap } = context;
    const { instanceOrder = {}, laneOrder = {} } = state;

    const category = categoriesHashmap[query.categoryId];

    const lanesHashmap = this.createLanesHashmap(
      category,
      settings.laneId,
      laneOrder
    );
    const cardUsersHashmap: { [id: string]: IUser } = {};
    const cardColorsHashmap: { [color: string]: IColorMapping } = {};

    let colorsMappingHashmap: { [value: string]: IColorMapping } = {};
    if (settings.colorFieldMapping) {
      colorsMappingHashmap = arrayOfObjectsToHashmap(
        'fieldValue',
        settings.colorFieldMapping.colorMapping
      );
    }

    data.forEach(instance => {
      const card = instanceMapping(settings, instance, colorsMappingHashmap);
      card.order = instanceOrder[card.id] || MAX_ORDER;

      if (card.assigned) {
        const user = usersHashmap[card.assigned];
        card.assignedUser = user;
        cardUsersHashmap[user.login] = user;
      } else if (!cardUsersHashmap[NO_ASSIGNED_ID]) {
        cardUsersHashmap[NO_ASSIGNED_ID] = {
          _id: NO_ASSIGNED_ID,
          login: '',
          name: 'No assigned',
          avatar: '',
        } as IUser;
      }

      if (card.colorMapping) {
        cardColorsHashmap[card.colorMapping.color] = card.colorMapping;
      }

      card.noFiltered = this.checkFilter(
        card.assigned || NO_ASSIGNED_ID,
        assignedFilter
      );

      card.noFiltered =
        card.noFiltered &&
        this.checkFilter(
          (card.colorMapping || ({} as IColorMapping)).color,
          colorFilter
        );

      const lane =
        lanesHashmap[card.laneId] ||
        ({
          id: card.laneId,
          title: card.laneId,
          cards: [],
          order: laneOrder[card.laneId] || MAX_ORDER,
        } as ILane);

      lane.cards.push(card);
      lanesHashmap[card.laneId] = lane;
    });

    const lanes = (Object as any).values(lanesHashmap).sort(sortByOrder);
    lanes.forEach(l => {
      l.cards = l.cards.filter(c => c.noFiltered).sort(sortByOrder);
      if (l.cards.length > 0) {
        l.label = l.cards.length.toString();
      }
    });

    return {
      lanes,
      totalCards: 0,
      users: (Object as any).values(cardUsersHashmap),
      colors: (Object as any).values(cardColorsHashmap),
    };
  }

  public renderBoard() {
    const boardMustBeRender = this.reRenderBoard;
    this.reRenderBoard = true;

    if (!boardMustBeRender) {
      return this.lastBoardRender;
    }

    const { view } = this.props;
    const { settings } = view;
    const { assignedFilter, colorFilter } = this.state;

    const isBoardConfigured = !!settings;

    let data = {} as IBoardData;
    if (isBoardConfigured) {
      data = this.getData();
    }

    this.lastBoardRender = (
      <React.Fragment>
        {isBoardConfigured && (
          <div className="head">
            <div className="quick-filters">
              <Select
                value={assignedFilter}
                showSearch={true}
                style={{ width: 200 }}
                allowClear={true}
                placeholder="Assigned to"
                onChange={value => {
                  this.handleFilterChange('assignedFilter', value);
                }}
              >
                {data.users.map(user => (
                  <Select.Option key={user._id} value={user._id}>
                    <Avatar size="small" src={user.avatar} />
                    &nbsp;&nbsp;
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                showSearch={true}
                style={{ width: 200, marginLeft: 10 }}
                placeholder="Color"
                value={colorFilter}
                allowClear={true}
                onChange={value => {
                  this.handleFilterChange('colorFilter', value);
                }}
              >
                {data.colors.map(c => (
                  <Select.Option key={c.color} value={c.color}>
                    <div
                      style={{
                        width: 30,
                        height: 15,
                        display: 'inline-block',
                        marginTop: 7,
                        backgroundColor: c.color,
                      }}
                    >
                      &nbsp;
                    </div>
                    <span
                      style={{
                        marginLeft: 7,
                        verticalAlign: 'top',
                      }}
                    >
                      {c.fieldValue}
                    </span>
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="toolbox">
              <Button icon="setting" onClick={this.handleSettingClick} />
            </div>
          </div>
        )}

        {isBoardConfigured && (
          <Board
            data={data}
            draggable={true}
            hideCardDeleteIcon={true}
            onCardClick={this.handleCardClick}
            handleDragEnd={this.handleDragEnd}
            newCardTemplate={<NewCardFormTemplate />}
            customCardLayout={true}
            className="boardContainer"
            onDataChange={this.handleDataChange}
          >
            <CardTemplate />
          </Board>
        )}
      </React.Fragment>
    );

    return this.lastBoardRender;
  }

  public render() {
    const { view, context } = this.props;
    const { categoriesHashmap } = context;
    const { settings, query } = view;
    const { showSettingDialog, instanceView } = this.state;

    const category = categoriesHashmap[query.categoryId];

    return (
      <NooketTrelloContainer>
        {this.renderBoard()}
        <Modal
          visible={showSettingDialog || !view.settings}
          title="Settings"
          onOk={this.handleSaveSettings}
          onCancel={this.handleCancelSettings}
          cancelButtonProps={{ disabled: !view.settings }}
        >
          <SettingsForm
            wrappedComponentRef={this.setSettingsFormInstance}
            category={category}
            {...settings || {}}
          />
        </Modal>
        {instanceView}
      </NooketTrelloContainer>
    );
  }
}

export default NooketTrello;
