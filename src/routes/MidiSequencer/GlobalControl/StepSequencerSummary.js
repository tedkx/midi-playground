import React from 'react';

const StepSequencerSummary = ({ active, data }) => {
  const { title = '' } = data || {};
  return (
    <div className={`step-sequencer-summary ${active && 'active'}`}>
      <div className="title">{title}</div>
      <div className="body"></div>
    </div>
  );
};

export default StepSequencerSummary;
