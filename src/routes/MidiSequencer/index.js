import React from 'react';
import { defaultPattern } from './constants';
import {
  createDefaultStepSequencersData,
  useNotesPlaying,
  useParameters,
} from './utils';
import GlobalControl, { globalParametersArr } from './GlobalControl';
import StepSequencer from './StepSequencer';

const MidiSequencer = () => {
  const [stepSequencersData, setStepSequencersData] = React.useState(
    createDefaultStepSequencersData(defaultPattern.stepSequencers)
  );

  const [activeSequencerIdx, setActiveSequencerIdx] = React.useState(0);
  const onSetStepSequencerData = React.useCallback(
    data => {
      const dataGetter = typeof data === 'function' ? data : () => data;
      setStepSequencersData(sequencers =>
        sequencers.map((currentData, idx) =>
          idx === activeSequencerIdx ? dataGetter(currentData) : currentData
        )
      );
    },
    [setStepSequencersData, activeSequencerIdx]
  );

  const { parameters, onSetParameter } = useParameters(globalParametersArr);

  const { activeNoteIdx, ...globalControlEvents } = useNotesPlaying(
    parameters,
    stepSequencersData
  );

  return (
    <div className="sequencer">
      <GlobalControl
        {...globalControlEvents}
        activeStepSequencerIdx={activeSequencerIdx}
        parameters={parameters}
        onSetParameter={onSetParameter}
        onSetActiveStepSequencerIdx={setActiveSequencerIdx}
        stepSequencersData={stepSequencersData}
      />
      <div className="step-sequencer">
        <StepSequencer
          activeNoteIdx={activeNoteIdx}
          data={stepSequencersData[activeSequencerIdx]}
          onSetData={onSetStepSequencerData}
        />
      </div>
    </div>
  );
};

export default MidiSequencer;
