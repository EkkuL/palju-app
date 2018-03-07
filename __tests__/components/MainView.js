import 'react-native';
import React from 'react';
import MainView from '../../src/components/MainView';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('MainView', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <MainView />
    );
  });
});

