const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const noteOffStart = 128;
const noteOnStart = 144;
const numOfChannels = 16;

const scales = {
  all: Array.from(Array(12)).map((_, idx) => 1),
  harmonic: [2, 1, 2, 2, 1, 3, 1],
  ionian: [2, 2, 1, 2, 2, 2, 1],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  aeolian: [2, 1, 2, 2, 1, 2, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
  altered: [1, 2, 1, 2, 2, 2, 2],
};

export { noteOnStart, noteOffStart, notes, numOfChannels, scales };
