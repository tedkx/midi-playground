import React from 'react';
import MidiContext from 'components/Midi/Context';
import { MidiMessages } from 'lib/enums';

const getIntervalMillis = (bpm, noteValue) => ((60000 / bpm) * 4) / noteValue;

const stepSequencerDataToSteps = stepSequencersData => {
  if (!Array.isArray(stepSequencersData)) return [];

  let stepsLength = stepSequencersData[0].notes.length;
  for (let i = 0; i < stepSequencersData.length; i++)
    if (stepSequencersData[i].length > stepsLength)
      stepsLength = stepSequencersData[i].length;

  return Array.from(Array(stepsLength)).map((_, idx) =>
    stepSequencersData.map(
      ({ channels, notes, noteDuration, transpose, velocity }) => ({
        channels,
        duration: noteDuration,
        note: notes[idx].note + transpose,
        on: notes[idx].on,
        velocity,
      })
    )
  );
};

const usePadEvents = setPadData => {
  const onClick = React.useCallback(
    padIndex =>
      setPadData(({ notes, ...pd }) =>
        pd.map((item, idx) =>
          idx === padIndex ? { ...item, on: !item.on } : item
        )
      ),
    [setPadData]
  );

  const onWheel = React.useCallback(
    (padIndex, direction) =>
      setPadData(({ notes, ...pd }) => ({
        ...pd,
        notes: notes.map((item, idx) =>
          idx === padIndex
            ? {
                ...item,
                note: direction === 'up' ? item.note + 1 : item.note - 1,
              }
            : item
        ),
      })),
    [setPadData]
  );

  return {
    onClick,
    onWheel,
  };
};

const useNotesPlaying = (
  { bpm, noteValue, ...parameters },
  stepSequencersData,
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
    steps: stepSequencerDataToSteps(stepSequencersData),
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
    ref.current.steps = stepSequencerDataToSteps(stepSequencersData);
  }, [stepSequencersData]);

  // the interval callback where all the interesting stuff take place
  const playNote = React.useCallback(() => {
    const { steps, noteIdx, tempoChangeRequested } = ref.current;

    // pending temp change. set intervalMillis, reset tempoChangeRequested and restart interval
    if (tempoChangeRequested) {
      clearInterval(ref.current.intervalId);
      ref.current.intervalMillis = tempoChangeRequested;
      ref.current.tempoChangeRequested = null;
      ref.current.intervalId = setInterval(playNote, tempoChangeRequested);
    }

    //const { note, on, velocity } = padData[noteIdx];
    const stepData = steps[noteIdx];
    setActiveNoteIdx(noteIdx);

    ref.current.noteIdx++;
    if (ref.current.noteIdx >= steps.length) ref.current.noteIdx = 0;

    // pad is not on, no sound required
    const { messages, messagesOffGroups } = stepData.reduce(
      (obj, { channels, duration, note, on, velocity }) => {
        if (on && velocity > 0)
          channels.forEach(channel => {
            obj.messages.push([
              MidiMessages[`Channel${channel}NoteOn`],
              note,
              velocity,
            ]);
            if (!obj.messagesOffGroups[duration])
              obj.messagesOffGroups[duration] = [];
            obj.messagesOffGroups[duration].push([
              MidiMessages[`Channel${channel}NoteOn`],
              note,
              0,
            ]);
          });

        return obj;
      },
      { messages: [], messagesOffGroups: {} }
    );

    if (!messages.length) return;

    messages.forEach(message => selectedOutput.send(message));
    Object.keys(messagesOffGroups).forEach(duration => {
      const messagesOff = messagesOffGroups[duration];
      setTimeout(
        () =>
          messagesOff.forEach(messageOff => selectedOutput.send(messageOff)),
        duration
      );
    });
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

const useParameters = (parametersArr, parameterValues = {}) => {
  const [parameters, setParameters] = React.useState(
    parametersArr.reduce((obj, parameterData) => {
      obj[parameterData.name] =
        parameterValues[parameterData.name] || parameterData.defaultValue;
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
