import React from 'react';
import { Route, Switch } from 'react-router-dom';

const MidiMessageViewer = React.lazy(() => import('./MidiMessageViewer'));

const basePath = '/tools';

const PoliciesContainer = () => {
  return (
    <Switch>
      <Route
        exact
        path={`${basePath}/midi-message-viewer`}
        component={MidiMessageViewer}
      />
    </Switch>
  );
};

export default PoliciesContainer;
