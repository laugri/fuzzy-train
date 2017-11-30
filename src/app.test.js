// @flow

import React from 'react';
import { shallow } from 'enzyme';
import App from './app';

describe('App', () => {
  test('renders without crashing', () => {
    shallow(<App />);
  });
});
