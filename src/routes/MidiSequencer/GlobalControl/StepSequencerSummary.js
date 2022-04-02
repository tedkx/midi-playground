import React from 'react';
import { LatchingButton } from 'components/KeyboardComponents';

const StepSequencerSummary = ({ active, data, onSelect }) => {
  const { title = '' } = data || {};

  const handleBlockBubble = React.useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`step-sequencer-summary ${active && 'active'}`}
      onClick={onSelect}
    >
      <div className="title">{title}</div>
      <div className="body">
        <div className="flex-spacer"></div>
        <div className="solo-mute">
          <LatchingButton
            activeColor="orange"
            onClick={handleBlockBubble}
            size="small"
          >
            Solo
          </LatchingButton>
          <LatchingButton
            activeColor="red"
            onClick={handleBlockBubble}
            size="small"
          >
            Mute
          </LatchingButton>
        </div>
      </div>
    </div>
  );
};

export default StepSequencerSummary;
