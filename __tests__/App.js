import 'react-native';
import React from 'react';
import App from '../src/App';

WebSocket = () => undefined;

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('App', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <App />
    );
  });
});
