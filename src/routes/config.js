import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import LoaderRoute from 'components/Loader/Route';
import Route404 from 'components/Routes/Route404';

import Dashboard from './Dashboard';

const Altered = React.lazy(() => import('./Altered'));
const Sequencer = React.lazy(() => import('./Sequencer'));
const Tools = React.lazy(() => import('./Tools'));

const RoutesConfig = () => (
  <Suspense fallback={<LoaderRoute />}>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/altered" component={Altered} />
      <Route path="/sequencer" component={Sequencer} />
      <Route path="/tools" component={Tools} />

      <Route exact path="*" component={Route404} />
    </Switch>
  </Suspense>
);

export default RoutesConfig;
