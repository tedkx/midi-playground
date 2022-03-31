import React from 'react';

const StepSequencerSummary = ({ active, data }) => {
  const { title = '' } = data || {};
  return <div style={{ fontWeight: active ? 'bold' : 'normal' }}>{title}</div>;
};

export default StepSequencerSummary;
