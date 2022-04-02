import React from 'react';
import { LatchingButton } from 'components/KeyboardComponents';

const StepSequencerSummary = ({ active, data }) => {
  const { title = '' } = data || {};
  return (
    <div className={`step-sequencer-summary ${active && 'active'}`}>
      <div className="title">{title}</div>
      <div className="body">
        <div className="flex-spacer"></div>
        <div className="solo-mute">
          <LatchingButton activeColor="orange" size="small">
            Solo
          </LatchingButton>
          <LatchingButton activeColor="red" size="small">
            Mute
          </LatchingButton>
        </div>
      </div>
    </div>
  );
};

export default StepSequencerSummary;
