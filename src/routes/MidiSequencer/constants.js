import { noteToMidi } from 'lib/utils';

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

  // tigran hanasyan's the grid intro
  theGrid: {
    bpm: 138,
    noteDuration: 100,
    notes:
      'G3 D4 G4 C5 D5 D#4 G4 A#4 D#5 F5 B3 G4 G#4 D5 D#5 F5 G5 G3 D4 G4 C5 D5 F4 G4 A#4 D#5 F5 C4 G4 G#4 D5 D#5',
    noteValue: 16,
  },
};

const formatPattern = pattern => ({
  ...pattern,
  notes: pattern.notes.split(' ').map(noteToMidi),
});

const defaultPattern = formatPattern(tunez.theGrid);

const sequencerParameterData = {
  noteDuration: createParameter(
    1,
    300,
    defaultPattern.noteDuration,
    'Note Duration'
  ),
  transpose: createParameter(-24, 24, 0, 'Transpose', true),
};

const globalParameterData = {
  bpm: createParameter(40, 280, defaultPattern.bpm, 'Tempo'),
  noteValue: createParameter(1, 32, defaultPattern.noteValue, 'NoteValue'),
};

export { defaultPattern, globalParameterData, sequencerParameterData };
