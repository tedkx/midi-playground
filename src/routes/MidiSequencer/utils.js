import React from 'react';
import MidiContext from 'components/Midi/Context';
import { MidiMessages } from 'lib/enums';
import { parameterData } from './constants';

const velocity = 50;
const numOfChannels = 4;

const getIntervalMillis = (bpm, noteValue) => ((60000 / bpm) * 4) / noteValue;

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
  { bpm, noteValue, ...parameters },
  padData,
  autostart
) => {
  const midiContext = React.useContext(MidiContext);
  const { selectedOutput } = midiContext;

  const [activeNoteIdx, setActiveNoteIdx] = React.useState(null);

  // keep almmost every param in ref so that they can be pick by interval callback playNote
  const ref = React.useRef({
    ...parameters,
    intervalId: null,
    intervalMillis: getIntervalMillis(bpm, noteValue),
    noteIdx: 0,
    padData,
    tempoChangeRequested: null,
  });

  // if interval active, store new bpm to tempoChangeRequested
  // it will be reset by the next playNote tick
  React.useEffect(() => {
    if (ref.current.intervalId !== null)
      ref.current.tempoChangeRequested = getIntervalMillis(bpm, noteValue);
    else ref.current.intervalMillis = getIntervalMillis(bpm, noteValue);
  }, [bpm, noteValue]);

  // update ref with the latest parameter values as they change
  React.useEffect(() => {
    Object.keys(parameters).forEach(key => {
      ref.current[key] = parameters[key];
    });
  }, [parameters]);

  // same for notes
  React.useEffect(() => {
    ref.current.padData = padData;
  }, [padData]);

  // the interval callback where all the interesting stuff take place
  const playNote = React.useCallback(() => {
    const { padData, noteDuration, noteIdx, tempoChangeRequested, transpose } =
      ref.current;

    // pending temp change. set intervalMillis, reset tempoChangeRequested and restart interval
    if (tempoChangeRequested) {
      clearInterval(ref.current.intervalId);
      ref.current.intervalMillis = tempoChangeRequested;
      ref.current.tempoChangeRequested = null;
      ref.current.intervalId = setInterval(playNote, tempoChangeRequested);
    }

    const { note, on } = padData[noteIdx];
    setActiveNoteIdx(noteIdx);

    ref.current.noteIdx++;
    if (ref.current.noteIdx >= padData.length) ref.current.noteIdx = 0;

    // pad is not on, no sound required
    if (!on) return;

    const messages = Array.from(Array(numOfChannels)).map((_, idx) => [
      MidiMessages[`Channel${idx + 1}NoteOn`],
      note + transpose,
      velocity,
    ]);

    messages.forEach(message => selectedOutput.send(message));
    setTimeout(
      () => messages.forEach(([t, n]) => selectedOutput.send([t, n, 0])),
      noteDuration
    );
  }, [selectedOutput]);

  // auto begin playing
  React.useEffect(() => {
    if (autostart && midiContext?.ready && midiContext.selectedOutput)
      ref.current.intervalId = setInterval(playNote, intervalMillis);

    return () => {
      clearInterval(ref.current.intervalId);
      ref.current.intervalId = null;
    };
  }, [autostart]);

  // start/stop/seek to start button callbacks
  const onSeekToStart = React.useCallback(() => {
    setActiveNoteIdx(0);
    ref.current.noteIdx = 0;
  }, [setActiveNoteIdx]);

  const onPlay = React.useCallback(() => {
    if (ref.current.intervalId === null)
      ref.current.intervalId = setInterval(
        playNote,
        ref.current.intervalMillis
      );
  }, [playNote]);

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
    Object.keys({ ...parameterData, ...pattern }).reduce((obj, key) => {
      if (key !== 'notes')
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
