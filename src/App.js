import React from 'react';
import { Switch } from 'react-router-dom';
import Layout from 'components/Layout';
import MidiContextProvider from 'components/Midi/Provider';
import RoutesConfig from './routes/config';
import './index.less';

function App() {
  return (
    <div className="app">
      <MidiContextProvider>
        <Layout>
          <Switch>
            <RoutesConfig />
          </Switch>
        </Layout>
      </MidiContextProvider>
    </div>
  );
}

export default App;
