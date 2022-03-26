import React from 'react';
import { Dropdown, Menu, Switch } from 'antd';

const MidiChannelsSelector = ({
  channels,
  numOfChannels,
  onSetChannels,
  title = 'Channels',
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const preventHide = React.useCallback(
    () => setMenuVisible(true),
    [setMenuVisible]
  );

  const handleSetChannels = React.useCallback(
    (channelNum, checked) =>
      onSetChannels(
        checked
          ? Array.from(new Set([...channels, channelNum])).sort((a, b) =>
              a > b ? 1 : a < b ? -1 : 0
            )
          : channels.filter(ch => ch !== channelNum)
      ),

    [numOfChannels, onSetChannels, channels]
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
                onChange={value => handleSetChannels(idx + 1, value)}
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
    <div className="numeric-parameter midi-channels">
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
