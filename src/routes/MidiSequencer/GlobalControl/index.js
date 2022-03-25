import React from 'react';
import { Button, ParameterKnob } from 'components/KeyboardComponents';
import { Card } from 'antd';
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import { globalParameterData } from '../constants';

export const globalParametersArr = Object.keys(globalParameterData).map(
  key => ({
    ...globalParameterData[key],
    name: key,
  })
);

const MidiSequencerGlobalControl = ({
  onPlay,
  onSeekToStart,
  onSetParameter,
  onStop,
  parameters,
}) => {
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
          {globalParametersArr.map(p => (
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
  );
};

export default MidiSequencerGlobalControl;
