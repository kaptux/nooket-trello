import * as React from 'react';
import { Icon, Avatar, Tooltip } from 'antd';
import * as moment from 'moment';

export default function CardTemplate({
  title,
  dueDate,
  assignedUser,
  hoursOfWork,
}: any) {
  return (
    <div className="card">
      <div>{title}</div>
      <div className="tagContainer">
        {dueDate && (
          <div className="tag">
            <Icon type="clock-circle" />
            &nbsp;
            {moment(dueDate).format('D MMM.')}
          </div>
        )}
      </div>
      {assignedUser && (
        <div className="user">
          <Tooltip title={assignedUser.name}>
            <Avatar src={assignedUser.avatar} />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
