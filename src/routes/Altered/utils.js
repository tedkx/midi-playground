import React from 'react';
import MidiContext from 'components/Midi/Context';
import { MidiPortState } from 'lib/enums';
import { isNoteOn, isNoteOff, noteToString, noteToMidi } from 'lib/midi';
import { noteOnStart, noteOffStart, scales } from 'lib/constants';
import {
  doneTimeoutMillis,
  inversion1,
  inversion2,
  scenarioStatuses,
  showHelpMillis,
  wrongNoteClearMillis,
} from './constants';

/** Listen for midi messages and keep track of active and wrong notes
 * @param {object} props.scenario - A { note, inversion } object containing the scale and desired inversion
 * @param {object} - React ref with the doneTimeoutId
 */
const useNotesListening = ({ scenario }, ref) => {
  const { selectedInput } = React.useContext(MidiContext);

  const [activeNotes, setActiveNotes] = React.useState([]);
  const [wrongNotes, setWrongNotes] = React.useState([]);

  React.useEffect(() => {
    setWrongNotes([]);
  }, [scenario]);

  // array with all allowed notes
  const scenarioNotes = React.useMemo(() => {
    if (!scenario) return null;
    const minNote = noteToMidi(`${scenario.note}0`);
    const maxNote = noteToMidi(`${scenario.note}8`);
    const scenarioNotes = [];
    let currentNote = minNote;
    let scaleIdx = 0;
    let octave = 0;
    while (currentNote <= maxNote) {
      scenarioNotes.push(currentNote);
      currentNote += scales.altered[scaleIdx];
      scaleIdx++;
      if (scaleIdx >= scales.altered.length) {
        scaleIdx = 0;
        octave++;
        currentNote = noteToMidi(`${scenario.note}${octave}`);
      }
    }
    return scenarioNotes;
  }, [scenario]);

  // keep track of active notes as they are played
  React.useEffect(() => {
    if (selectedInput && selectedInput.state === MidiPortState.Connected) {
      selectedInput.onmidimessage = ({ data }) => {
        const [messageType, note] = data;
        if (messageType !== noteOnStart && messageType !== noteOffStart) return;

        if (isNoteOn(data)) {
          clearTimeout(ref.current.doneTimeoutId);
          setActiveNotes(curr => [...curr, note].sort());
          // wrong note
          if (!scenarioNotes.includes(note)) setWrongNotes(wr => [...wr, note]);
        } else if (isNoteOff(data)) {
          setActiveNotes(curr =>
            curr.filter(activeNote => activeNote !== note)
          );
          // slowly clear wrong notes
          if (!scenarioNotes.includes(note))
            setTimeout(
              () =>
                setWrongNotes(wr => wr.filter(wrongNote => wrongNote !== note)),
              wrongNoteClearMillis
            );
        }
      };
    }
  }, [selectedInput, scenarioNotes]);

  return {
    activeNotes,
    scenarioNotes,
    wrongNotes,
  };
};

/** Keep track and advance scenario status, test for correct chord
 * @param {function} props.onCompletion - Callback for when test passed and stopped playing
 * @param {object} props.scenario - A { note, inversion } object containing the scale and desired inversion
 * @param {Array<number>} activeNotes - Notes currently playing
 * @param {object} - React ref with the doneTimeoutId
 */
const useScenarioTesting = ({ onCompletion, scenario }, activeNotes, ref) => {
  const [scenarioStatus, setScenarioStatus] = React.useState(
    scenarioStatuses.Starting
  );

  // reset status whenever test scenario changes
  React.useEffect(() => {
    setScenarioStatus(scenarioStatuses.Starting);
  }, [scenario]);

  const handleCountdownCompletion = React.useCallback(
    () => setScenarioStatus(scenarioStatuses.Testing),
    [setScenarioStatus]
  );

  // check if bottom 4 notes correspond to correct chord
  React.useEffect(() => {
    if (scenarioStatus !== scenarioStatuses.Testing || activeNotes.length < 4)
      return;
    const { spaces, start } =
      scenario.inversion === 1 ? inversion1 : inversion2;

    const baseScaleNote = noteToString(activeNotes[0] - start);
    if (baseScaleNote.substr(0, baseScaleNote.length - 1) !== scenario.note)
      return;

    let spaceIdx = 0;
    while (spaceIdx < spaces.length) {
      if (
        activeNotes[spaceIdx + 1] - activeNotes[spaceIdx] !==
        spaces[spaceIdx]
      )
        return;
      spaceIdx++;
    }
    setScenarioStatus(scenarioStatuses.Success);
  }, [activeNotes, scenarioStatus, scenario]);

  // advance to next scenario when success and not played a note for doneTimeoutMillis
  React.useEffect(() => {
    if (
      scenarioStatus === scenarioStatuses.Success &&
      activeNotes.length === 0
    ) {
      ref.current.doneTimeoutId = setTimeout(() => {
        setScenarioStatus(scenarioStatuses.Done);
        onCompletion();
      }, doneTimeoutMillis);
    }
  }, [activeNotes, scenarioStatus]);

  return {
    handleCountdownCompletion,
    scenarioStatus,
  };
};

/** Show the notes to play if some time passed and no success */
const useScenarioHelp = ({ scenario }, scenarioNotes, scenarioStatus) => {
  const ref = React.useRef({ helpTimeoutId: null, scenarioStatus });

  const [helpNotes, setHelpNotes] = React.useState(null);

  React.useEffect(() => {
    ref.current.scenarioStatus = scenarioStatus;
  }, [scenarioStatus]);

  const cleanup = React.useCallback(() => {
    clearTimeout(ref.current.helpTimeoutId);
    setHelpNotes(null);
  }, []);

  React.useEffect(() => {
    cleanup();
  }, [scenario]);

  React.useEffect(() => {
    if (scenario && scenarioStatus === scenarioStatuses.Testing)
      ref.current.helpTimeoutId = setTimeout(() => {
        if (ref.current.scenarioStatus === scenarioStatuses.Testing) {
          const { spaces, start } =
            scenario.inversion === 1 ? inversion1 : inversion2;
          const chordNotes = spaces.reduce(
            (arr, space) => {
              arr.push(arr[arr.length - 1] + space);
              return arr;
            },
            [scenarioNotes[0] + start]
          );
          setHelpNotes(
            chordNotes
              .map(note => {
                const str = noteToString(note);
                return str.substr(0, str.length - 1);
              })
              .join(' ')
          );
        }
      }, showHelpMillis);
    else cleanup();
  }, [scenario, scenarioStatus]);

  return helpNotes;
};

const roundMillisToDecimal = (millis, precision) => {
  if (typeof millis !== 'number') return millis;
  if (typeof precision !== 'number' || precision < 0 || precision > 3)
    precision = 1;

  const divisor = Math.pow(10, 3 - precision);

  return (Math.round(millis / divisor) * divisor) / 1000;
};

const useScenarioTiming = scenarioStatus => {
  const [times, setTimes] = React.useState([]);
  const [startTime, setStartTime] = React.useState(null);

  React.useEffect(() => {
    if (scenarioStatus === scenarioStatuses.Testing) {
      setStartTime(new Date());
    } else if (scenarioStatus === scenarioStatuses.Success) {
      setTimes(currentTimes =>
        (currentTimes.length <= 100
          ? currentTimes
          : currentTimes.slice(currentTimes.length - 100)
        ).concat(new Date() - startTime)
      );
      setStartTime(null);
    }
  }, [scenarioStatus]);

  const meanTime = React.useMemo(
    () =>
      times.length
        ? roundMillisToDecimal(
            times.reduce((sum, time) => sum + time, 0) / times.length
          )
        : null,
    [times]
  );

  const roundedTime = React.useMemo(
    () =>
      times[times.length - 1]
        ? roundMillisToDecimal(times[times.length - 1])
        : 0,
    [times]
  );

  return {
    time: roundedTime,
    meanTime,
  };
};

export {
  useNotesListening,
  useScenarioHelp,
  useScenarioTesting,
  useScenarioTiming,
};
