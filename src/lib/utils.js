import { noteOnStart, noteOffStart, numOfChannels, notes } from './constants';

const noteToString = number => {
  const octave = Math.floor(number / notes.length);
  const note = number % notes.length;
  return `${notes[note]}${octave}`;
};

const noteToMidi = str => {
  const [_, note, octave] = (str || '').match(/(\w{1,2})(\d{1})/) || [];
  return !note || !octave
    ? null
    : octave * notes.length + notes.findIndex(note.toUpperCase());
};

// check for noteOn number
const isNoteOn = midiMessage =>
  midiMessage[0] >= noteOnStart &&
  midiMessage[0] <= noteOnStart + numOfChannels &&
  midiMessage[2] > 0;

// either noteOff number or noteOn and velocity is 0
const isNoteOff = midiMessage =>
  (midiMessage[0] >= noteOffStart &&
    midiMessage[0] <= noteOffStart + numOfChannels) ||
  (midiMessage[0] >= noteOnStart &&
    midiMessage[0] <= noteOnStart + numOfChannels &&
    midiMessage[2] === 0);

window.noteToString = noteToString;
window.noteToMidi = noteToMidi;

export { isNoteOn, isNoteOff, noteToMidi, noteToString };
