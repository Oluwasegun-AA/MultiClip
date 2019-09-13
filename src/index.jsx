import React from 'react';
import { render } from 'react-dom';
import { App } from './client/components/index';
import { Provider } from 'react-redux';
import store from './client/store';
import './client/styles/index.scss';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
