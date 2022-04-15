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
        title: 'Voice',
      },
      {
        channels: [1],
        noteDuration: 100,
        notes: 'F5 C6 G6 F7 E7 A#6 A5 E6 B6 A#7 A7 D#7 G7 F#7 D7 F7 E7 C#7',
        title: 'Voice 4th up',
      },
    ],
  },

  // chaka khan's ain't no nobody - testing polyrhythmic sequences
  aintNobody: {
    bpm: 100,
    noteValue: 16,
    stepSequencers: [
      {
        channels: [1],
        noteDuration: 100,
        notes: 'D#3 A#3 C#4 D#4 D#4 A#4 C#5 D#5 D#6',
        title: 'Sampler',
      },
      {
        channels: [1],
        noteDuration: 100,
        notes:
          'x x x x F#6:100 x F#6:100 x F#6:100 D#6:100 A#5:100 G#6:100 x G#6:100 F6:100 C#6:100',
        title: 'Melody',
      },
    ],
  },

  // a dark knight theme
  darkKnight: {
    bpm: 100,
    noteValue: 16,
    stepSequencers: [
      {
        channels: [15, 16],
        noteDuration: 100,
        notes:
          'F5:70 A4 D5:70 A4 F5:70 A4 D5:70 A4 F5:70 A4 D5:70 A4 F5:70 A#4 D5:70 A#4',
        title: 'Strings',
      },
      {
        channels: [14],
        noteDuration: 100,
        notes: 'x D4 x x D4 x D4 x x D4 x x D4 x D4 x',
        title: 'Synth',
      },
    ],
    velocity: 60,
  },

  // 09:37 in this video: https://www.youtube.com/watch?v=EcXupJGNw1s
  foundPattern01: {
    bpm: 80,
    noteValue: 16,
    stepSequencers: [
      {
        channels: [1, 2, 3, 4],
        noteDuration: 100,
        notes: 'F4 A#5 C6 F6 C7 F7 C8 F#6 F#4 C#5 G#5 C6 C#6 A#5 F6 C#5',
        title: 'Pattern 1',
      },
    ],
  },
};

export default tunez;
