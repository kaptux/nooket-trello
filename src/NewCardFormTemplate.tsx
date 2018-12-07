import * as React from 'react';
import { Button, Input } from 'antd';

const { TextArea } = Input;

class NewCardFormTemplate extends React.Component<any, any> {
  updateField = (field, evt) => {
    this.setState({ [field]: evt.target.value });
  };

  handleAdd = () => {
    this.props.onAdd(this.state);
  };

  render() {
    const { onCancel } = this.props;
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 3,
          border: '1px solid #eee',
          borderBottom: '1px solid #ccc',
        }}
      >
        <div style={{ padding: 5, margin: 5 }}>
          <div>
            <div style={{ marginBottom: 5 }}>
              <TextArea
                onChange={evt => this.updateField('title', evt)}
                autosize={true}
              />
            </div>
          </div>
          <Button type="primary" size="small" onClick={this.handleAdd}>
            Add
          </Button>
          <Button size="small" onClick={onCancel} style={{ marginLeft: 10 }}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default NewCardFormTemplate;
