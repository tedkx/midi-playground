import React from 'react';
import MidiContext from 'components/Midi/Context';
import {
  MidiMessages,
  defaultIgnoreMessages as ignoreMessages,
} from 'lib/enums';
import { leastCommonMultiple } from 'lib/utils';
import { isNoteOn } from 'lib/midi';
import {
  defaultNote,
  defaultPatternLength,
  defaultVelocity,
  sequencerModes,
  stepSequencerColors,
} from './constants';

const getIntervalMillis = (bpm, noteValue) => ((60000 / bpm) * 4) / noteValue;

const createNote = (
  note = defaultNote,
  velocity = defaultVelocity,
  on = true
) => ({
  note,
  on,
  velocity,
});

const usePadEvents = setPadData => {
  const onClick = React.useCallback(
    (padIndex, _, e) => {
      console.log('clicked');
      setPadData(({ notes, ...pd }) => ({
        ...pd,
        notes: notes.map((item, idx) =>
          idx === padIndex ? { ...item, on: !item.on } : item
        ),
      }));
    },
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

  const onDelete = React.useCallback((e, index) => {
    console.log('deleting', index);
    e.preventDefault();
    e.stopPropagation();
    setPadData(({ notes, ...pd }) => ({
      ...pd,
      notes: notes.filter((_, idx) => idx !== index),
    }));
    return false;
  }, []);

  return {
    onClick,
    onDelete,
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
    stepIdx: 0,
    sequencersData: [],
    tempoChangeRequested: null,
    totalSteps: 0,
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

  // same for sequencer data
  React.useEffect(() => {
    if (Array.isArray(stepSequencersData)) {
      ref.current.sequencersData = stepSequencersData;

      const lengths = new Set();
      let atLeastOneSolo = false;

      stepSequencersData.forEach(seq => {
        lengths.add(seq.notes.length);
        atLeastOneSolo ||= seq.solo;
      });

      ref.current.atLeastOneSolo = atLeastOneSolo;
      ref.current.totalSteps = leastCommonMultiple(Array.from(lengths));
    }
  }, [stepSequencersData]);

  // the interval callback where all the interesting stuff take place
  const playNote = React.useCallback(() => {
    const {
      atLeastOneSolo,
      sequencersData,
      stepIdx,
      tempoChangeRequested,
      totalSteps,
    } = ref.current;

    // pending temp change. set intervalMillis, reset tempoChangeRequested and restart interval
    if (tempoChangeRequested) {
      clearInterval(ref.current.intervalId);
      ref.current.intervalMillis = tempoChangeRequested;
      ref.current.tempoChangeRequested = null;
      ref.current.intervalId = setInterval(playNote, tempoChangeRequested);
    }

    setActiveNoteIdx(stepIdx);

    ref.current.stepIdx++;
    if (ref.current.stepIdx >= totalSteps) ref.current.stepIdx = 0;

    // pad is not on, no sound required
    const { messages, messagesOffGroups } = sequencersData.reduce(
      (obj, { channels, mute, noteDuration, notes, solo, transpose }) => {
        if (atLeastOneSolo && !solo) return obj;
        if (mute) return obj;

        const { note, on, velocity } = notes[stepIdx % notes.length];
        if (on && velocity > 0)
          channels.forEach(channel => {
            const actualNote = note + transpose;
            obj.messages.push([
              MidiMessages[`Channel${channel}NoteOn`],
              actualNote,
              velocity,
            ]);
            if (!obj.messagesOffGroups[noteDuration])
              obj.messagesOffGroups[noteDuration] = [];
            obj.messagesOffGroups[noteDuration].push([
              MidiMessages[`Channel${channel}NoteOn`],
              actualNote,
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
    ref.current.stepIdx = 0;
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

const createDefaultStepSequencerData = (stepSequencerData, idx) => ({
  channels: stepSequencerData?.channels || [1],
  color: stepSequencerColors[idx % stepSequencerColors.length],
  mute: stepSequencerData?.mute || false,
  noteDuration: stepSequencerData?.noteDuration || 100,
  notes:
    stepSequencerData?.notes ||
    Array.from(Array(defaultPatternLength)).map(() => createNote()),
  solo: stepSequencerData?.solo || false,
  title: stepSequencerData?.title || `StepSequencer ${idx + 1}`,
  transpose: stepSequencerData?.transpose || 0,
});
const createDefaultStepSequencersData = tuneSequencers => {
  const sequencers = Array.isArray(tuneSequencers) ? tuneSequencers : [];
  return sequencers.map(createDefaultStepSequencerData);
};

const useStepRecording = setPadData => {
  const ref = React.useRef({ noteTimeouts: {} });
  const { subscribe } = React.useContext(MidiContext);
  const [mode, setMode] = React.useState(sequencerModes.play);

  const onToggleRecording = React.useCallback(isRecording =>
    setMode(isRecording ? sequencerModes.record : sequencerModes.play)
  );

  // handle note addition through keyboard
  const onAddNote = React.useCallback(
    midiMessage => {
      if (!isNoteOn(midiMessage)) return;

      const note = midiMessage[1];
      clearTimeout(ref.current.noteTimeouts[note]);
      ref.current.noteTimeouts[note] = setTimeout(() => {
        setPadData(({ notes, ...pd }) => ({
          ...pd,
          notes: notes.concat({ note, on: true, velocity: 60 }),
        }));
      }, 50);
    },
    [setPadData]
  );

  const isRecording = mode === sequencerModes.record;

  // when recording mode on, subscribe to midi note events
  React.useEffect(() => {
    let unsubscribe = null;
    if (isRecording) unsubscribe = subscribe(onAddNote, { ignoreMessages });

    return () => unsubscribe && unsubscribe();
  }, [isRecording]);

  return {
    isRecording: mode === sequencerModes.record,
    mode,
    onToggleRecording,
    setMode,
  };
};

export {
  createDefaultStepSequencersData,
  createNote,
  useNotesPlaying,
  useParameters,
  usePadEvents,
  useStepRecording,
};
