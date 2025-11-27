/**
 * Input Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Input from '../../src/components/Input';

describe('Input Component', () => {
  it('renders correctly with label', () => {
    const {getByText} = render(
      <Input label="Test Label" placeholder="Enter text" value="" onChangeText={() => {}} />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const {getByPlaceholderText} = render(
      <Input placeholder="Enter text" value="" onChangeText={onChangeText} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'New text');
    expect(onChangeText).toHaveBeenCalledWith('New text');
  });

  it('displays error message', () => {
    const {getByText} = render(
      <Input
        placeholder="Enter text"
        value=""
        onChangeText={() => {}}
        error="This field is required"
      />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders with left icon', () => {
    const {getByPlaceholderText} = render(
      <Input
        placeholder="Enter text"
        value=""
        onChangeText={() => {}}
        leftIcon="email"
      />
    );
    // Input should be rendered
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('handles secure text entry', () => {
    const {getByPlaceholderText} = render(
      <Input
        placeholder="Enter password"
        value=""
        onChangeText={() => {}}
        secureTextEntry={true}
      />
    );
    const input = getByPlaceholderText('Enter password');
    expect(input.props.secureTextEntry).toBe(true);
  });
});

