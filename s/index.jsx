import React from 'react';
// import { render } from 'react-dom';
import { render } from 'react-snapshot';
import { Provider } from 'react-redux';
import { App } from './client/components/index';
import store from './client/store';
import './client/styles/index.scss';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
