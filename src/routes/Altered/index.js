import React from 'react';
import { Card } from 'antd';
import AlteredPracticeScenario from './PracticeScenario';
import { notes } from 'lib/constants';

const scenarios = notes.reduce((arr, note) => {
  arr.push({ note, inversion: 1 });
  arr.push({ note, inversion: 2 });
  return arr;
}, []);

const Altered = () => {
  const [activeScenario, setActiveScenario] = React.useState(null);
  const selectScenario = React.useCallback(() => {
    const rand = Math.random() * scenarios.length;
    let newScenario = activeScenario;
    while (newScenario === activeScenario)
      newScenario = scenarios[Math.floor(rand)];
    setActiveScenario(newScenario);
  }, [activeScenario, setActiveScenario]);

  React.useEffect(() => {
    selectScenario();
  }, []);

  return (
    <div>
      <Card bordered={false}>
        <h2>Altered Scale Random Chord Practice</h2>
        Play the chord displayed in altered scale on your left hand. Help will
        be displayed if you take too long.
        <br />
        Inversion 1 starts from the minor 7th (ie for C: B). Inversion 2 starts
        from the major 3rd (ie for C: E).
      </Card>
      <AlteredPracticeScenario
        onCompletion={selectScenario}
        scenario={activeScenario}
      />
    </div>
  );
};

export default Altered;
