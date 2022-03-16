import React from 'react';
import MidiContext from 'components/Midi/Context';
import Pad from 'components/KeyboardComponents/Pad';
import { MidiMessages } from 'lib/enums';
import { defaultNotes } from './constants';
import { usePadEvents, useNotesPlaying } from './utils';
import { noteToString } from 'lib/utils';

const Sequencer = () => {
  const [padData, setPadData] = React.useState(
    defaultNotes.map(note => ({
      note,
      on: true,
    }))
  );

  const padEvents = usePadEvents(padData, setPadData);

  const activeNoteIdx = useNotesPlaying(padData);

  return (
    <div className="sequencer">
      {padData.map(({ note, on }, idx) => (
        <>
          <Pad
            active={activeNoteIdx === idx}
            index={idx}
            key={note}
            on={on}
            {...padEvents}
          >
            {noteToString(note)}
          </Pad>
          {(idx + 1) % 8 === 0 && <div className="flex-breaker" />}
        </>
      ))}
    </div>
  );
};

export default Sequencer;
