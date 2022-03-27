const tunez = {
  //lazerhawk's lawless
  lawless: {
    bpm: 90,
    stepSequencers: [
      {
        channels: [1],
        noteDuration: 30,
        notes:
          'C4 G4 C5 D#5 D5 C5 D5 D#5 G5 D#5 D5 C5 G4 F4 D#4 D4 C6 C6 C6 C5 C5 C5 C6 C6 C6 G5 D#5 D5 C5 G4 D#4 D4',
      },
    ],
    noteValue: 16,
  },

  // tigran hamasyan's the grid intro
  theGrid: {
    bpm: 138,
    stepSequencers: [
      {
        channels: [1, 2, 3, 4],
        noteDuration: 100,
        notes:
          'G3 D4 G4 C5 D5 D#4 G4 A#4 D#5 F5 B3 G4 G#4 D5 D#5 F5 G5 G3 D4 G4 C5 D5 F4 G4 A#4 D#5 F5 C4 G4 G#4 D5 D#5',
      },
    ],
    noteValue: 16,
  },

  // tigran hamasyan's new maps
  newMaps: {
    bpm: 120,
    stepSequencers: [
      {
        channels: [1, 2, 3, 4],
        noteDuration: 600,
        notes:
          'C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G#5:90 C5 G#4 C#5 D#5 A#4 C5 G#5:90 G#5:0 C5 A#4 C5 G#5 C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G5:90 C5 G#4 C#5 D#5 A#4 C#5 A#5:90 A#5:0 C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G#5:90 C5 G#4 C#5 D#5 A#4 C5 G#5:90 G#5:0 C5 A#4 C5 G#5 C5 A#4 C5 G#5:90 C#5 G#4 D#5 C5 A#4 G5:90 A#4 G#4 C#5 D#5 A#4 C#5 C6:90 C6:0',
      },
    ],
    noteValue: 16,
    velocity: 54,
  },

  // dream theater's metropolis mid keyboard part
  metropolis: {
    bpm: 120,
    noteValue: 16,
    stepSequencers: [
      {
        channels: [1],
        noteDuration: 100,
        notes: 'C5 G5 D6 C7 B6 F6 E5 B5 F#6 F7 E7 A#6 D7 C#7 A6 C7 B6 G#6',
      },
      {
        channels: [1],
        noteDuration: 100,
        notes: 'F5 C6 G6 F7 E7 A#6 A5 E6 B6 A#7 A7 D#7 G7 F#7 D7 F7 E7 C#7',
      },
    ],
  },
};

export default tunez;
