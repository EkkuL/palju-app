import 'react-native';
import { Text } from 'react-native';
import React from 'react';
import GraphView from '../../src/components/GraphView';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('GraphView', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <GraphView />
    );
  });

  it('should have text "Moi" in Text component', () => {
    const tree = renderer.create(
      <GraphView />
    );

    const { root } = tree;

    expect(root.findByType(Text).children[0].children).toEqual(['Moi']);
  });
});
