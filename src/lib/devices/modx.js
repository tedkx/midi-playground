const partsNum = 8;
const basePartNum = 176;

const PartKnobs = {
  ...Array.from(Array(8)).reduce((obj, _, idx) => {
    obj[`AssignableKnob${idx + 1}`] = 17 + idx;
    return obj;
  }, {}),
  Cutoff: 74,
  Resonance: 71,
  Pan: 10,
  Portamento: 5,
};

const MidiMessages = {
  ActiveSensing: 254,
  Clock: 248,
  ...Array.from(Array(partsNum)).reduce((obj, _, idx) => {
    obj[`Part${idx + 1}_Fader`] = `${basePartNum + idx}_7`;
    for (let key of Object.keys(PartKnobs))
      obj[`Part${idx + 1}_${key}`] = `${basePartNum + idx}_${PartKnobs[key]}`;
    return obj;
  }, {}),
  ...Array.from(Array(partsNum)).reduce((obj, _, idx) => {
    obj[`Scene${idx + 1}`] = `${basePartNum}_92_${idx * 16}`;
    return obj;
  }, {}),
  ...Array.from(Array(partsNum)).reduce((obj, _, idx) => {
    obj[`Part${idx + 1}SustainOn`] = `${basePartNum + idx}_64`;
    return obj;
  }, {}),
  ...Array.from(Array(partsNum)).reduce((obj, _, idx) => {
    obj[`Part${idx + 1}ExpressionPedal`] = `${basePartNum + idx}_11`;
    return obj;
  }, {}),
  Assign1: '176_86',
  Assign2: '176_87',
  ModulationWheel: '176_1',
  MotionSeqHold: '176_88',
  MotionSeqTrigger: '176_89',
  PausePlayback: 252,
  ResumePlayback: 251,
  StartPlayback: 250,
  Superknob: '176_95',
};

export { MidiMessages };
