import { noteToMidi } from 'lib/utils';

const defaultVelocity = 64;
const defaultNote = 'C5';
const defaultPatternLength = 16;

const createParameter = (min, max, defaultValue, title, centerBased) => ({
  centerBased: centerBased === true,
  defaultValue,
  max,
  min,
  title,
});

const tunez = {
  //lazerhawk's lawless
  lawless: {
    bpm: 90,
    noteDuration: 30,
    notes:
      'C4 G4 C5 D#5 D5 C5 D5 D#5 G5 D#5 D5 C5 G4 F4 D#4 D4 C6 C6 C6 C5 C5 C5 C6 C6 C6 G5 D#5 D5 C5 G4 D#4 D4',
    noteValue: 16,
  },

  // tigran hamasyan's the grid intro
  theGrid: {
    bpm: 138,
    noteDuration: 100,
    notes:
      'G3 D4 G4 C5 D5 D#4 G4 A#4 D#5 F5 B3 G4 G#4 D5 D#5 F5 G5 G3 D4 G4 C5 D5 F4 G4 A#4 D#5 F5 C4 G4 G#4 D5 D#5',
    noteValue: 16,
  },

  // tigran hamasyan's new maps
  newMaps: {
    bpm: 120,
    noteDuration: 600,
    notes:
      'C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G#5:90 C5 G#4 C#5 D#5 A#4 C5 G#5:90 G#5:0 C5 A#4 C5 G#5 C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G5:90 C5 G#4 C#5 D#5 A#4 C#5 A#5:90 A#5:0 C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G#5:90 C5 G#4 C#5 D#5 A#4 C5 G#5:90 G#5:0 C5 A#4 C5 G#5 C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G5:90 A#4 G#4 C#5 D#5 A#4 C#5 C6:90 C6:0',
    noteValue: 16,
    velocity: 54,
  },
};

const formatPattern = pattern => ({
  ...pattern,
  notes: pattern.notes.split(' ').map(item => {
    const [note, velocityStr] = item.split(':');
    const velocity = parseInt(velocityStr);
    return {
      note: noteToMidi(note),
      on: velocity !== 0,
      velocity: isNaN(velocity)
        ? pattern.velocity || defaultVelocity
        : velocity,
    };
  }),
});

const defaultPattern = formatPattern(tunez.newMaps);

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
  sequencerParameterData,
};
