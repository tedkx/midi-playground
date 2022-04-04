import React from 'react';
import { Card, InputNumber } from 'antd';
import { Pad, ParameterKnob } from 'components/KeyboardComponents';
import MidiChannelsSelector from './MidiChannelsSelector';
import { sequencerParameterData } from '../constants';
import { usePadEvents, useParameters } from '../utils';
import { noteToString } from 'lib/midi';
import { numOfChannels } from 'lib/constants';
import SequenceLengthModifier from './SequenceLengthModifier';

const parametersArr = Object.keys(sequencerParameterData).map(key => ({
  ...sequencerParameterData[key],
  name: key,
}));

const StepSequencer = ({ activeNoteIdx, data, onSetData }) => {
  const { noteDuration, transpose } = data;

  const sequencerActiveNoteIdx = React.useMemo(
    () =>
      data && Array.isArray(data.notes)
        ? activeNoteIdx % data.notes.length
        : activeNoteIdx,
    [activeNoteIdx, data]
  );

  const parameterValues = React.useMemo(
    () => ({ noteDuration, transpose }),
    [noteDuration, transpose]
  );

  const { parameters, onSetParameter } = useParameters(
    parametersArr,
    parameterValues
  );

  React.useEffect(
    () => onSetData(d => ({ ...d, ...parameters })),
    [parameters]
  );

  const handleSequenceLengthChanged = React.useCallback(
    notes =>
      onSetData(currentData => ({
        ...currentData,
        notes,
      })),
    [onSetData]
  );

  const handleChannelsChange = React.useCallback(
    channels =>
      onSetData(currentData => ({
        ...currentData,
        channels,
      })),
    [onSetData]
  );

  const padEvents = usePadEvents(onSetData);

  return (
    <div className="step-sequencer">
      <div className="controls">
        <Card bordered={false}>
          <div className="step-sequencer-title">
            <div
              className="step-sequencer-color"
              style={{ backgroundColor: data?.color }}
            ></div>
            <span>{data?.title}</span>
          </div>
          <div className="flex-spacer"></div>
          <SequenceLengthModifier
            notes={data?.notes}
            onChange={handleSequenceLengthChanged}
          />
          <MidiChannelsSelector
            channels={data?.channels}
            numOfChannels={numOfChannels}
            onSetChannels={handleChannelsChange}
            title="Channels"
          />
          {parametersArr.map(p => (
            <ParameterKnob
              {...p}
              key={p.name}
              onSetParameter={onSetParameter}
              value={parameters[p.name]}
            />
          ))}
        </Card>
      </div>
      <div className="pads-container">
        {Array.isArray(data?.notes) &&
          data.notes.map(({ note, on }, idx) => (
            <>
              <Pad
                active={sequencerActiveNoteIdx === idx}
                index={idx}
                key={note}
                on={on}
                {...padEvents}
              >
                {noteToString(note)}
              </Pad>
              {(idx + 1) % 8 === 0 && <div className="flex-breaker" />}
            </>
          ))}
      </div>
    </div>
  );
};

export default StepSequencer;
