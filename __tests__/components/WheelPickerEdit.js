import 'react-native';
import React from 'react';
import WheelPickerEdit from '../../src/components/WheelPickerEdit';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('WheelPickerEdit', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <WheelPickerEdit />
    );
  });

  it('should have correct initial state', () => {
    const tree = renderer.create(
      <WheelPickerEdit />
    );

    const { state } = tree.getInstance();

    expect(state).toEqual({ values: [null, null] });
  });
});

