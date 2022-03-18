const PartKnobs = {
  AssignableKnob1: 17,
  AssignableKnob2: 18,
  AssignableKnob3: 19,
  AssignableKnob4: 20,
  AssignableKnob5: 21,
  AssignableKnob6: 22,
  AssignableKnob7: 23,
  AssignableKnob8: 24,
  Cutoff: 74,
  Resonance: 71,
  Pan: 10,
  Portamento: 5,
};

const MidiMessages = {
  ActiveSensing: 254,
  Clock: 248,
  ...Array.from(Array(8)).reduce((obj, _, idx) => {
    obj[`Part${idx + 1}_Fader`] = `${176 + idx}_7`;
    for (let key of Object.keys(PartKnobs))
      obj[`Part${idx + 1}_${key}`] = `${176 + idx}_${PartKnobs[key]}`;
    return obj;
  }, {}),
  ...Array.from(Array(8)).reduce((obj, _, idx) => {
    obj[`Scene${idx + 1}`] = `176_92_${idx * 16}`;
    return obj;
  }, {}),
  Assign1: '176_86',
  Assign2: '176_87',
  ModulationWheel: '176_1',
  MotionSeqHold: '176_88',
  MotionSeqTrigger: '176_89',
  Superknob: '176_95',
};

export { MidiMessages };
