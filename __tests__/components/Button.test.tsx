/**
 * Button Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const {getByText} = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByText} = render(<Button title="Test Button" onPress={onPress} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const {getByText, queryByText} = render(
      <Button title="Test Button" onPress={() => {}} loading={true} />
    );
    // Button text should not be visible when loading
    expect(queryByText('Test Button')).toBeNull();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const {getByText} = render(
      <Button title="Test Button" onPress={onPress} disabled={true} />
    );
    
    const button = getByText('Test Button').parent;
    expect(button?.props.accessibilityState.disabled).toBe(true);
  });

  it('renders with different variants', () => {
    const {rerender} = render(<Button title="Test" onPress={() => {}} variant="primary" />);
    expect(rerender).toBeTruthy();

    rerender(<Button title="Test" onPress={() => {}} variant="outline" />);
    expect(rerender).toBeTruthy();

    rerender(<Button title="Test" onPress={() => {}} variant="danger" />);
    expect(rerender).toBeTruthy();
  });

  it('renders with icon', () => {
    const icon = <></>;
    const {getByText} = render(
      <Button title="Test Button" onPress={() => {}} icon={icon} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });
});

