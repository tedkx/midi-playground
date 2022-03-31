import { noteToMidi } from 'lib/midi';
import tunes from './tunes';

const defaultVelocity = 64;
const defaultNote = noteToMidi('C5');
const defaultPatternLength = 16;
const maxSequencerNotes = 120;

const createParameter = (min, max, defaultValue, title, centerBased) => ({
  centerBased: centerBased === true,
  defaultValue,
  max,
  min,
  title,
});

const formatPattern = ({ stepSequencers, ...pattern }) => ({
  ...pattern,
  stepSequencers: stepSequencers.map(
    ({ notes, title, ...stepSequencer }, idx) => ({
      ...stepSequencer,
      title: title || `Step Sequencer ${idx + 1}`,
      transpose: 0,
      notes: notes.split(' ').map(item => {
        const [note, velocityStr] = item.split(':');
        const pause = note === 'x';
        const velocity = pause ? 0 : parseInt(velocityStr);
        return {
          note: pause ? null : noteToMidi(note),
          on: velocity !== 0,
          velocity: isNaN(velocity)
            ? pattern.velocity || defaultVelocity
            : velocity,
        };
      }),
    })
  ),
});

const defaultPattern = formatPattern(tunes.aintNobody);

const sequencerParameterData = {
  noteDuration: createParameter(
    1,
    1000,
    defaultPattern.noteDuration,
    'Note Duration'
  ),
  transpose: createParameter(-24, 24, 0, 'Transpose', true),
};

const globalParameterData = {
  bpm: createParameter(40, 280, defaultPattern.bpm, 'Tempo'),
  noteValue: createParameter(1, 32, defaultPattern.noteValue, 'NoteValue'),
};

export {
  defaultNote,
  defaultPattern,
  defaultPatternLength,
  defaultVelocity,
  globalParameterData,
  maxSequencerNotes,
  sequencerParameterData,
};
