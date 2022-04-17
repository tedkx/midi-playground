import React from 'react';
import { Card } from 'antd';
import MidiContext from 'components/Midi/Context';
import {
  defaultIgnoreMessages as ignoreMessages,
  MidiMessageCodes,
  MidiMessages,
} from 'lib/enums';
import { noteToString } from 'lib/midi';
import { isFunc } from 'lib/utils';

const style = {
  fontFamily: 'Consolas',
  height: 'calc(100vh - 108px)',
  textShadow: '1px 1px #222',
  overflowY: 'scroll',
};

const MidiMessageViewer = () => {
  const { ready, subscribe } = React.useContext(MidiContext);
  const [lines, setLines] = React.useState([]);

  const ref = React.useRef({
    start: null,
    numOfMessages: 0,
    unsubscribe: null,
  });

  const appendLine = React.useCallback(
    data => {
      const arr = Array.from(data);

      let sliceLength = 3,
        additionalText = '';
      while (sliceLength > 0) {
        const key = arr.slice(0, sliceLength).join('_');
        const type = MidiMessageCodes[key];
        if (type) {
          additionalText =
            type.indexOf('Note') >= 0
              ? `${type} ${noteToString(arr[1])} Velocity ${arr[2]}`
              : sliceLength === 2
              ? `${type} Value ${arr[2]}`
              : `${type} ${arr.slice(sliceLength).join(' ')}`;
          break;
        }

        sliceLength--;
      }

      const text = `${arr[0]} ${arr[1]} ${arr[2]} - ${additionalText}`;
      setLines(currentLines =>
        currentLines.slice(currentLines.length - 100).concat(text)
      );
    },
    [setLines]
  );

  React.useEffect(() => {
    if (ready)
      ref.current.unsubscribe = subscribe(appendLine, { ignoreMessages });

    return () =>
      ready && isFunc(ref.current.unsubscribe) && ref.current.unsubscribe();
  }, [ready]);

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
