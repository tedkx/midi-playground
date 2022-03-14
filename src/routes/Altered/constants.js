const inversion1 = {
  start: 10,
  spaces: [5, 1, 4],
};
const inversion2 = {
  start: 4,
  spaces: [4, 2, 5],
};
const doneTimeoutMillis = 1000;
const wrongNoteClearMillis = 3000;
const countdownStart = 2;
const showHelpMillis = 6000;

const scenarioStatuses = {
  Starting: 'starting',
  Testing: 'testing',
  Success: 'success',
  Done: 'done',
};

export {
  countdownStart,
  doneTimeoutMillis,
  inversion1,
  inversion2,
  scenarioStatuses,
  showHelpMillis,
  wrongNoteClearMillis,
};
