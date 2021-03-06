import React from 'react';
import { Button, ParameterKnob } from 'components/KeyboardComponents';
import { Card, Select } from 'antd';
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import { globalParameterData } from '../constants';
import StepSequencerSummary from './StepSequencerSummary';
import { useKeyboardControl } from './keyboardControl';

import { Note1, Note2, Note4, Note8, Note16, Note32 } from 'assets/notes';

const notesOptions = [
  { label: <Note1 color="#EEE" />, value: 1 },
  { label: <Note2 color="#EEE" />, value: 2 },
  { label: <Note4 color="#EEE" />, value: 4 },
  { label: <Note8 color="#EEE" />, value: 8 },
  { label: <Note16 color="#EEE" />, value: 16 },
  { label: <Note32 color="#EEE" />, value: 32 },
];

export const globalParametersArr = Object.keys(globalParameterData).map(
  key => ({
    ...globalParameterData[key],
    name: key,
  })
);

const MidiSequencerGlobalControl = props => {
  const {
    activeStepSequencerIdx,
    onPlay,
    onSeekToStart,
    onSetActiveStepSequencerIdx,
    onSetData,
    onSetParameter,
    onStop,
    parameters,
    stepSequencersData,
  } = props;

  const handleSetStepSequencerParameter = React.useCallback(
    (idx, name, value) =>
      onSetData(currentData =>
        Array.isArray(currentData)
          ? currentData.map((seqData, seqIdx) =>
              seqIdx === idx ? { ...seqData, [name]: value } : seqData
            )
          : currentData
      ),
    [onSetData]
  );

  useKeyboardControl(props);

  return (
    <div className="global-controls">
      <Card bordered={false}>
        <div className="control-row">
          <Button onClick={onSeekToStart}>
            <StepBackwardOutlined />
          </Button>
          <Button onClick={onPlay}>
            <CaretRightOutlined />
          </Button>
          <Button onClick={onStop}>
            <PauseOutlined />
          </Button>
        </div>
        <div className="control-row">
          <ParameterKnob
            {...globalParameterData.bpm}
            name="bpm"
            onSetParameter={onSetParameter}
            value={parameters.bpm}
          />
          <div className="select-parameter">
            <div className="title">NoteValue</div>
            <Select
              className="note-value-select"
              dropdownClassName="note-value-select-list"
              listHeight={280}
              onSelect={value => onSetParameter('noteValue', value)}
              options={notesOptions}
              size="large"
              value={parameters.noteValue}
            />
          </div>
        </div>
      </Card>
      <br />
      <Card bordered={false}>
        {stepSequencersData.map((seq, idx) => (
          <StepSequencerSummary
            active={activeStepSequencerIdx === idx}
            data={seq}
            onSelect={() => onSetActiveStepSequencerIdx(idx)}
            onSetParameter={(name, value) =>
              handleSetStepSequencerParameter(idx, name, value)
            }
            key={idx}
          />
        ))}
      </Card>
    </div>
  );
};

export default MidiSequencerGlobalControl;
