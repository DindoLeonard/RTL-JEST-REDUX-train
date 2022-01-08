/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './Input';

it('has is-invalid class for input when help is set', () => {
  render(<Input help="Error message" />);
  const input = screen.getByTestId('input');
  expect(input).toHaveClass('is-invalid');
});

it('has invalid-feedback class for span while help is set', () => {
  // const { container } = render(<Input help="Error message" />);
  // // eslint-disable-next-line testing-library/no-container
  // const span = container.querySelector('span');
  // // eslint-disable-next-line jest/valid-expect
  // expect(span?.classList).toContain('invalid-feedback');
  render(<Input help="Error message" />);
  const span = screen.getByText('Error message');
  expect(span).toHaveClass('invalid-feedback');
});

it('does not have is-invalid class for input when help is not set', () => {
  render(<Input />);
  const input = screen.getByTestId('input');
  expect(input).not.toHaveClass('is-invalid');
});
