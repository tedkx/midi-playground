import React from 'react';
import { Card } from 'antd';
import { Button, Pad, RotaryKnob } from 'components/KeyboardComponents';
import { defaultPattern } from './constants';
import { usePadEvents, useParameters, useNotesPlaying } from './utils';
import { noteToString } from 'lib/utils';
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';

const Sequencer = () => {
  const [padData, setPadData] = React.useState(
    defaultPattern.notes.map(note => ({
      note,
      on: true,
    }))
  );

  const { parameters, setParameter } = useParameters(defaultPattern);

  const { activeNoteIdx, onSeekToStart, onPlay, onStop } = useNotesPlaying(
    defaultPattern,
    padData
  );

  const padEvents = usePadEvents(padData, setPadData);

  return (
    <div className="sequencer">
      <div className="controls">
        <Card bordered={false}>
          <Button onClick={onSeekToStart}>
            <StepBackwardOutlined />
          </Button>
          <Button onClick={onPlay}>
            <CaretRightOutlined />
          </Button>
          <Button onClick={onStop}>
            <PauseOutlined />
          </Button>
        </Card>
        <Card bordered={false}>
          <RotaryKnob value={64} />
        </Card>
      </div>
      <div className="pads-container">
        {padData.map(({ note, on }, idx) => (
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

export default Sequencer;
