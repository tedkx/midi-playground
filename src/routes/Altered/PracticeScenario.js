import React from 'react';
import { Card, Collapse } from 'antd';
import { CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { noteToString } from 'lib/utils';
import {
  useNotesListening,
  useScenarioHelp,
  useScenarioTesting,
  useScenarioTiming,
} from './utils';
import Countdown from 'components/Countdown';
import { countdownStart, scenarioStatuses } from './constants';
import SimpleCollapse from '../../components/SimpleCollapse';

const AlteredPracticeScenario = props => {
  const { scenario } = props;

  const ref = React.useRef({ doneTimeoutId: null });

  const { activeNotes, scenarioNotes, wrongNotes } = useNotesListening(
    props,
    ref
  );

  const { handleCountdownCompletion, scenarioStatus } = useScenarioTesting(
    props,
    activeNotes,
    ref
  );

  const helpNotes = useScenarioHelp(props, scenarioNotes, scenarioStatus);

  const { time, meanTime } = useScenarioTiming(scenarioStatus);

  return (
    <>
      <Card bordered={false} className="altered-scenario">
        {scenarioStatus === scenarioStatuses.Starting && scenario && (
          <Countdown
            from={countdownStart}
            onCompletion={handleCountdownCompletion}
          />
        )}
        {scenarioStatus !== scenarioStatuses.Starting && (
          <div className="scenario-title">
            {scenario.note} Inv{scenario.inversion}
            <SimpleCollapse in={scenarioStatus === scenarioStatuses.Success}>
              <CheckCircleFilled />
              <br />
              <span className={`time ${time > meanTime ? 'slow' : 'fast'}`}>
                {time} secs
              </span>
            </SimpleCollapse>
          </div>
        )}
        <SimpleCollapse className="help" in={helpNotes !== null}>
          <InfoCircleOutlined />
          {helpNotes}
        </SimpleCollapse>

        <SimpleCollapse className="wrong-notes-wrap" in={wrongNotes.length}>
          {wrongNotes.map(note => noteToString(note)).join(' ')}
        </SimpleCollapse>
      </Card>
      {meanTime && (
        <Card bordered={false} style={{ textAlign: 'right' }}>
          {' '}
          Mean Time: <strong>{meanTime} secs</strong>
        </Card>
      )}
    </>
  );
};

export default AlteredPracticeScenario;
