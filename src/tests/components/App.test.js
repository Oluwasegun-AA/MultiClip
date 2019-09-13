import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '../../client/components/index';
import { shallow } from 'enzyme';

describe('demo test', () => {
  let windowSpy;
  beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get').mockImplementation(() => ({
      require: () => ({ ipcRenderer: {}, ipcMain: {} }),
    }));
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
