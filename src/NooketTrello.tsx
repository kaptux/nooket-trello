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
import { instanceMapping, sortByOrder } from './utils';
import { IBoardData, ICard, ILane } from './types';

import Board from 'react-trello';

const MAX_ORDER = 9999999;
const NO_ASSIGNED_ID = '00001';

const NooketTrelloContainer = styled.div`
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
  private initialBoardState;

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
      this.reRenderBoard = false;
    });
  };
  private buildInitialState = () => {
    const instanceOrder = {};
    const laneOrder = {};

    this.initialBoardState.lanes.forEach((l, i) => {
      laneOrder[l.id] = i;
      l.cards.forEach((c, j) => {
        instanceOrder[c.id] = j;
      });
    });

    return {
      instanceOrder,
      laneOrder,
    };
  };
  private handleLaneDragEnd = (laneId, newPosition) => {
    console.log(laneId, newPosition);
    const { onSaveState, view } = this.props;

    let viewState = view.state;
    if (!viewState) {
      viewState = this.buildInitialState();
    }

    viewState.laneOrder[laneId] = newPosition;

    onSaveState(viewState);
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
  private handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    const { onSaveInstance, context } = this.props;
    console.log(cardId, sourceLaneId, targetLaneId, position, cardDetails);
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

    data.forEach(instance => {
      const card = instanceMapping<ICard>(settings, instance);
      card.title = instance.title;
      card.id = instance._id;
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

      card.noFiltered = this.checkFilter(
        card.assigned || NO_ASSIGNED_ID,
        assignedFilter
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
    });

    this.initialBoardState = {
      lanes: (Object as any).values(lanesHashmap),
      totalCards: 0,
      users: (Object as any).values(cardUsersHashmap),
    };

    return this.initialBoardState;
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
              />
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
            handleLaneDragEnd={this.handleLaneDragEnd}
            handleDragEnd={this.handleDragEnd}
            newCardTemplate={<NewCardFormTemplate />}
            customCardLayout={true}
            className="boardContainer"
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
      </NooketTrelloContainer>
    );
  }
}

export default NooketTrello;
