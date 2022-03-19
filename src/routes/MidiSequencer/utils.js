import React from 'react';
import MidiContext from 'components/Midi/Context';
import { MidiMessages } from 'lib/enums';
import { parameterData } from './constants';

const velocity = 50;
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

const useNotesPlaying = (
  { bpm, noteValue, noteDuration = 30 },
  padData,
  autostart
) => {
  const midiContext = React.useContext(MidiContext);
  const { selectedOutput } = midiContext;

  const [activeNoteIdx, setActiveNoteIdx] = React.useState(null);

  const intervalMillis = React.useMemo(
    () => ((60000 / bpm) * 4) / noteValue,
    [bpm, noteValue]
  );

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
    if (autostart && midiContext?.ready && midiContext.selectedOutput)
      ref.current.intervalId = setInterval(playNote, intervalMillis);

    return () => {
      clearInterval(ref.current.intervalId);
      ref.current.intervalId = null;
    };
  }, [autostart]);

  React.useEffect(() => {
    if (ref.current.intervalId !== null) {
      clearInterval(ref.current.intervalId);
      setInterval(playNote, intervalMillis);
    }
  }, [playNote, intervalMillis]);

  const onSeekToStart = React.useCallback(() => {
    setActiveNoteIdx(0);
    ref.current.noteIdx = 0;
  }, [setActiveNoteIdx]);

  const onPlay = React.useCallback(() => {
    if (ref.current.intervalId === null)
      ref.current.intervalId = setInterval(playNote, intervalMillis);
  }, [playNote, intervalMillis]);

  const onStop = React.useCallback(() => {
    clearInterval(ref.current.intervalId);
    ref.current.intervalId = null;
  }, []);

  return {
    activeNoteIdx,
    onPlay,
    onSeekToStart,
    onStop,
  };
};

const useParameters = pattern => {
  const [parameters, setParameters] = React.useState(
    Object.keys(parameterData).reduce((obj, key) => {
      obj[key] =
        typeof pattern[key] === 'number'
          ? pattern[key]
          : parameterData[key].defaultValue;
      return obj;
    }, {})
  );

  const onSetParameter = React.useCallback(
    (name, value) =>
      setParameters(curr => ({
        ...curr,
        [name]: value,
      })),
    []
  );

  return {
    onSetParameter,
    parameters,
  };
};

export { useNotesPlaying, useParameters, usePadEvents };
