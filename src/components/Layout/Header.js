import React from 'react';
import { Layout, Tag, Tooltip } from 'antd';
import { ControlOutlined } from '@ant-design/icons';
import MidiContext from 'components/Midi/Context';

const { Header: AntHeader } = Layout;

const Header = () => {
  const { selectedInput, selectedOutput, toggleSettings } =
    React.useContext(MidiContext);

  return (
    <AntHeader>
      <div style={{ marginRight: 10 }}>
        Input: <Tag color="success">{selectedInput?.name}</Tag> |
      </div>
      <div>
        Output: <Tag color="success">{selectedOutput?.name}</Tag>
      </div>
      <div className="flex-spacer"></div>
      <Tooltip title="Settings">
        <ControlOutlined onClick={toggleSettings} />
      </Tooltip>
    </AntHeader>
  );
};

export default Header;
