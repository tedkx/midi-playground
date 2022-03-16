import React from 'react';
import MidiContext from 'components/Midi/Context';
import { MidiMessages } from 'lib/enums';

const bpm = 90;
const noteValue = 16;
const intervalMillis = ((60000 / bpm) * 4) / noteValue;
const velocity = 50;
const noteDuration = 30;
const numOfChannels = 4;

const usePadEvents = (padData, setPadData) => {
  const onClick = React.useCallback(
    padIndex =>
      setPadData(pd =>
        pd.map((item, idx) =>
          idx === padIndex ? { ...item, on: !item.on } : item
        )
      ),
    [setPadData]
  );

  const onWheel = React.useCallback(
    (padIndex, direction) =>
      setPadData(pd =>
        pd.map((item, idx) =>
          idx === padIndex
            ? {
                ...item,
                note: direction === 'up' ? item.note + 1 : item.note - 1,
              }
            : item
        )
      ),
    [setPadData]
  );

  return {
    onClick,
    onWheel,
  };
};

const useNotesPlaying = padData => {
  const midiContext = React.useContext(MidiContext);
  const { selectedOutput } = midiContext;

  const [activeNoteIdx, setActiveNoteIdx] = React.useState(null);

  const ref = React.useRef({
    intervalId: null,
    noteIdx: 0,
    padData,
  });

  React.useEffect(() => {
    ref.current.padData = padData;
  }, [padData]);

  const playNote = React.useCallback(() => {
    const { note, on } = ref.current.padData[ref.current.noteIdx];
    setActiveNoteIdx(ref.current.noteIdx);
    ref.current.noteIdx++;
    if (ref.current.noteIdx >= ref.current.padData.length)
      ref.current.noteIdx = 0;

    if (!on) return;
    const messages = Array.from(Array(numOfChannels)).map((_, idx) => [
      MidiMessages[`Channel${idx + 1}NoteOn`],
      note,
      velocity,
    ]);

    messages.forEach(message => selectedOutput.send(message));
    setTimeout(
      () => messages.forEach(([t, n]) => selectedOutput.send([t, n, 0])),
      noteDuration
    );
  }, [selectedOutput]);

  React.useEffect(() => {
    if (midiContext?.ready && midiContext.selectedOutput)
      ref.current.intervalId = setInterval(playNote, intervalMillis);

    return () => {
      clearInterval(ref.current.intervalId);
    };
  }, [midiContext]);

  return activeNoteIdx;
};

export { useNotesPlaying, usePadEvents };
