import React from 'react';
import { InputNumber } from 'antd';
import { maxSequencerNotes } from '../constants';
import { createNote } from '../utils';

const SequenceLengthModifier = ({ notes, onChange }) => {
  const handleChange = React.useCallback(
    valueOrEvent => {
      const value =
        typeof valueOrEvent === 'number'
          ? valueOrEvent
          : Math.max(
              1,
              Math.min(maxSequencerNotes, parseInt(valueOrEvent.target?.value))
            );

      onChange(
        value > notes.length
          ? [
              ...notes,
              ...Array.from(Array(value - notes.length)).map(() =>
                createNote()
              ),
            ]
          : notes.slice(0, value)
      );
    },
    [notes, onChange]
  );

  return (
    <div className="sequence-length-modifier numeric-parameter">
      <div className="title"># Pads</div>
      <InputNumber
        bordered={false}
        max={maxSequencerNotes}
        min={1}
        onBlur={handleChange}
        onPressEnter={handleChange}
        onStep={handleChange}
        defaultValue={notes?.length || 1}
      />
    </div>
  );
};

export default SequenceLengthModifier;
