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

export { MidiMessageCodes, MidiMessages, MidiPortConnection, MidiPortState };
