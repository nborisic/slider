import React from 'react';
import { Route, Switch } from 'react-router-dom';


// import Dashboard from 'views/Dashboard';
// import About from 'views/About';
import NotFound from 'views/NotFound';
import Home from 'views/Home';
// import PageShell from '../components/Global/PageShell';
// import fadesUp from '../components/Global/box';
// import Slider from '../components/Global/slider';
// import LazySlider from '../components/Global/lazy-slider';

const publicPath = '/';

export const routeCodes = {
  DASHBOARD: publicPath,
  SLIDE: `${ publicPath }:slideView`,
};

export default () => (
  <Switch>
    <Route exact path={ publicPath } component={ Home } />
    <Route path={ routeCodes.SLIDE } component={ Home } />
    <Route path='*' component={ NotFound } />
  </Switch>
);
