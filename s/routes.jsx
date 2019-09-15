import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { Home } from './client/views/index';

const Routes = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
