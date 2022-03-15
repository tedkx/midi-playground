import React from 'react';
import MidiContext from 'components/Midi/Context';
import Pad from 'components/KeyboardComponents/Pad';
import { MidiMessages } from 'lib/enums';
import { defaultNotes } from './constants';

const bpm = 90;
const noteValue = 16;
const intervalMillis = ((60000 / bpm) * 4) / noteValue;
const velocity = 50;
const noteDuration = 30;
//set default sample to lazerhawk's lawless

const Sequencer = () => {
  const ref = React.useRef({
    intervalId: null,
    noteIdx: 0,
    notes: defaultNotes,
  });
  const midiContext = React.useContext(MidiContext);
  const { selectedOutput } = midiContext;
  const [activeNoteIdx, setActiveNoteIdx] = React.useState(null);

  const playNote = React.useCallback(() => {
    const note = ref.current.notes[ref.current.noteIdx];
    setActiveNoteIdx(ref.current.noteIdx);
    ref.current.noteIdx++;
    if (ref.current.noteIdx >= ref.current.notes.length)
      ref.current.noteIdx = 0;

    selectedOutput.send([MidiMessages.Channel1NoteOn, note, velocity]);
    setTimeout(
      () => selectedOutput.send([MidiMessages.Channel1NoteOn, note, 0]),
      noteDuration
    );
  }, [selectedOutput]);

  React.useEffect(() => {
    var asdf = 'asdf';
    if (midiContext?.ready && midiContext.selectedOutput)
      ref.current.intervalId = setInterval(playNote, intervalMillis);

    return () => {
      clearInterval(ref.current.intervalId);
    };
  }, [midiContext]);

  return (
    <div className="sequencer">
      {ref.current.notes.map((note, idx) => (
        <>
          <Pad active={activeNoteIdx === idx} key={note} />
          {(idx + 1) % 8 === 0 && <div className="flex-breaker" />}
        </>
      ))}
    </div>
  );
};

export default Sequencer;
