import React from 'react';
import { Card } from 'antd';
import MidiContext from 'components/Midi/Context';
import { MidiMessageCodes, MidiMessages, MidiPortState } from 'lib/enums';
import { noteToString } from 'lib/utils';

const style = {
  fontFamily: 'Consolas',
  height: 'calc(100vh - 108px)',
  textShadow: '1px 1px #222',
  overflowY: 'scroll',
};

const MidiMessageViewer = props => {
  const { selectedInput } = React.useContext(MidiContext);
  const [lines, setLines] = React.useState([]);
  const appendLine = React.useCallback(
    ({ data }) => {
      if (
        data[0] === MidiMessages.ActiveSensing ||
        data[0] === MidiMessages.Clock
      )
        return;
      const [type, note, velocity] = data;
      const text = `${type} ${note} ${velocity} - ${
        MidiMessageCodes[type]
      } ${noteToString(note)} Velocity ${velocity}`;
      setLines(currentLines =>
        currentLines.slice(currentLines.length - 100).concat(text)
      );
    },
    [setLines]
  );

  React.useEffect(() => {
    if (selectedInput && selectedInput.state === MidiPortState.Connected)
      selectedInput.onmidimessage = appendLine;
  }, [selectedInput]);

  return (
    <Card bordered={false} style={style}>
      {lines.map(line => (
        <>
          {line}
          <br />
        </>
      ))}
    </Card>
  );
};

export default MidiMessageViewer;
