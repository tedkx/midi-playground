import React from 'react';
import { Card, InputNumber } from 'antd';
import { Pad, ParameterKnob } from 'components/KeyboardComponents';
import MidiChannelsSelector from './MidiChannelsSelector';
import { sequencerParameterData } from '../constants';
import { usePadEvents, useParameters } from '../utils';
import { noteToString } from 'lib/utils';
import { numOfChannels } from 'lib/constants';

const parametersArr = Object.keys(sequencerParameterData).map(key => ({
  ...sequencerParameterData[key],
  name: key,
}));

const StepSequencer = ({ activeNoteIdx, data, onSetData }) => {
  const { noteDuration, transpose } = data;

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
                active={activeNoteIdx === idx}
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
