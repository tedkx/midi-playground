import React from 'react';
import { Dropdown, Menu, Switch } from 'antd';

const MidiChannelsSelector = ({
  channels,
  numOfChannels,
  onSetData,
  title = 'Channels',
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const preventHide = React.useCallback(
    () => setMenuVisible(true),
    [setMenuVisible]
  );

  const onSetChannels = React.useCallback(
    (channelNum, checked) =>
      onSetData(({ channels: currentChannels, ...currentData }) => ({
        ...currentData,
        channels: checked
          ? Array.from(new Set([...currentChannels, channelNum])).sort((a, b) =>
              a > b ? 1 : a < b ? -1 : 0
            )
          : currentChannels.filter(ch => ch !== channelNum),
      })),
    [numOfChannels, onSetData]
  );

  const menu = React.useMemo(
    () => (
      <Menu className="midi-channels-menu" onClick={preventHide}>
        {Array.from(Array(numOfChannels)).map((_, idx) => (
          <Menu.Item key={idx + 1}>
            <div className="menu-item">
              <div>{idx + 1} </div>
              <Switch
                checked={channels.includes(idx + 1)}
                onChange={value => onSetChannels(idx + 1, value)}
                size="small"
              />
            </div>
          </Menu.Item>
        ))}
      </Menu>
    ),
    [channels, numOfChannels]
  );

  const content = React.useMemo(() => {
    if (!channels) return '';
    const { range, other } = channels.reduce(
      (obj, channel) => {
        if (
          obj.range.length > 0 &&
          channel - obj.range[obj.range.length - 1] > 1
        )
          obj.other.push(channel);
        else obj.range.push(channel);
        return obj;
      },
      { range: [], other: [] }
    );

    return range.length > 1
      ? `${range[0]}-${range[range.length - 1]}${other.length > 0 ? '..' : ''}`
      : [...range, ...other].filter((_, idx) => idx < 3).join(',') +
          (other.length > 2 ? '..' : '');
  }, [channels]);

  return (
    <div className="midi-channels">
      <Dropdown
        onVisibleChange={setMenuVisible}
        overlay={menu}
        placement="bottomRight"
        visible={menuVisible}
      >
        <div>
          <div className="title">{title}</div>
          <div className="content">{content}</div>
        </div>
      </Dropdown>
    </div>
  );
};

export default MidiChannelsSelector;
