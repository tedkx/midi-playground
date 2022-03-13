import { noteOffStart, noteOnStart, numOfChannels } from './constants';

const MidiPortState = {
  Connected: 'connected',
  Disconnected: 'disconected',
};

const MidiPortConnection = {
  Connected: 'connected',
  Disconnected: 'disconected',
  Pending: 'pending',
};

// https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes

const MidiMessages = {
  ActiveSensing: 254,
  ...Array.from(Array(numOfChannels)).reduce((obj, _, idx) => {
    obj[`Channel${idx + 1}NoteOff`] = noteOffStart + idx;
    obj[`Channel${idx + 1}NoteOn`] = noteOnStart + idx;
    return obj;
  }, {}),
  PitchBendStart: 224,
  PitchBendEnd: 225,
  Clock: 248,
};

const MidiMessageCodes = Object.keys(MidiMessages).reduce((obj, key) => {
  obj[MidiMessages[key]] = key;
  return obj;
}, {});

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
  altered: [1, 2, 1, 2, 2, 2],
};

export {
  MidiMessageCodes,
  MidiMessages,
  MidiPortConnection,
  MidiPortState,
  scales,
};
