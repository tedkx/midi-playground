import React from 'react';
import MidiContext from 'components/Midi/Context';
import Settings from './Settings';
import { MidiMessages, MidiMessageCodes, MidiPortState } from 'lib/enums';
import { isNoteOn, isNoteOff, noteToString } from 'lib/utils';
import { noteOnStart, noteOffStart } from '../../lib/constants';

const Altered = props => {
  const { selectedInput } = React.useContext(MidiContext);

  React.useEffect(() => {
    if (selectedInput && selectedInput.state === MidiPortState.Connected) {
      selectedInput.onmidimessage = ({ data, ...rest }) => {
        if (data[0] !== noteOnStart && data[0] !== noteOffStart) return;
        if (isNoteOn(data))
          console.log(
            'playing',
            noteToString(data[1]),
            'with',
            data[2],
            'velocity |',
            MidiMessageCodes[data[0]]
          );
        else if (isNoteOff(data))
          console.log(
            'stopped playing',
            noteToString(data[1]),
            '|',
            MidiMessageCodes[data[0]]
          );
        else
          console.log('unknown midi message', data, MidiMessageCodes[data[0]]);
      };
    }
  }, [selectedInput]);

  return (
    <div>
      <Settings />
    </div>
  );
};

export default Altered;
