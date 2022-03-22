import React from 'react';
import { Card } from 'antd';
import { Button, Pad } from 'components/KeyboardComponents';
import ParameterKnob from './ParameterKnob';
import { noteToMidi } from 'lib/utils';
import { defaultPattern, globalParameterData } from './constants';
import { useParameters, useNotesPlaying } from './utils';
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import StepSequencer from './StepSequencer';

const velocity = 50;
const channels = [1, 2, 3, 4];

const parametersArr = Object.keys(globalParameterData).map(key => ({
  ...globalParameterData[key],
  name: key,
}));

const MidiSequencer = () => {
  const [stepSequencersData, setStepSequencersData] = React.useState([
    {
      channels,
      noteDuration: defaultPattern.noteDuration,
      notes: defaultPattern.notes.map(note => ({
        note,
        on: true,
      })),
      transpose: 0,
      velocity,
    },
  ]);

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

  const { parameters, onSetParameter } = useParameters(parametersArr);

  const { activeNoteIdx, onSeekToStart, onPlay, onStop } = useNotesPlaying(
    parameters,
    stepSequencersData
  );

  return (
    <div className="sequencer">
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
            {parametersArr.map(p => (
              <ParameterKnob
                {...p}
                key={p.name}
                onSetParameter={onSetParameter}
                value={parameters[p.name]}
              />
            ))}
          </div>
        </Card>
      </div>
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
