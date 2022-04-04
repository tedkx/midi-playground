import React from 'react';
import { LatchingButton } from 'components/KeyboardComponents';

const StepSequencerSummary = ({ active, data, onSelect, onSetParameter }) => {
  const { title = '' } = data || {};

  const handleBlockBubble = React.useCallback(e => {
    e.stopPropagation();
  }, []);

  const handleToggleSolo = React.useCallback(
    value => onSetParameter('solo', value),
    [onSetParameter]
  );
  const handleToggleMute = React.useCallback(
    value => onSetParameter('mute', value),
    [onSetParameter]
  );

  return (
    <div
      className={`step-sequencer-summary ${active && 'active'}`}
      onClick={onSelect}
    >
      <div className="step-sequencer-title">
        <div
          className="step-sequencer-color"
          style={{ backgroundColor: data?.color }}
        ></div>
        <span>{title}</span>
      </div>
      <div className="sequencer-summary-body">
        <div className="flex-spacer"></div>
        <div className="solo-mute">
          <LatchingButton
            activeColor="orange"
            onActiveChanged={handleToggleSolo}
            onClick={handleBlockBubble}
            size="small"
          >
            Solo
          </LatchingButton>
          <LatchingButton
            activeColor="red"
            onActiveChanged={handleToggleMute}
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
