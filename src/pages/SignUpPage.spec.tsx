import React from 'react';
import SignUpPage from './SignUpPage';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

describe('Sign Up Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<SignUpPage />);

      const header = screen.queryByRole('heading', { name: /sign up/i });

      expect(header).toBeInTheDocument();
    });

    it('has username input', () => {
      render(<SignUpPage />);

      // const { container } = render(<SignUpPage />);
      // // eslint-disable-next-line testing-library/no-container
      // const input = container.querySelector('input');
      // expect(input).toBeInTheDocument();

      // const input = screen.getByPlaceholderText('username');
      // expect(input).toBeInTheDocument();

      const input = screen.getByLabelText(/username/i);
      expect(input).toBeInTheDocument();
    });

    it('has email input', () => {
      render(<SignUpPage />);

      // const { container } = render(<SignUpPage />);
      // // eslint-disable-next-line testing-library/no-container
      // const inputs = container.querySelectorAll('input');
      // expect(inputs).toHaveLength(2);

      // const input = screen.getByPlaceholderText('email');
      // expect(input).toBeInTheDocument();

      const input = screen.getByLabelText(/e-mail/i);
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText(/password repeat/i);
      expect(input).toBeInTheDocument();
    });

    it('has password type for password repeat input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText(
        /password repeat/i
      ) as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has Sign up button', () => {
      render(<SignUpPage />);
      const button = screen.queryByRole('button', { name: /sign up/i });
      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', () => {
      render(<SignUpPage />);
      const button = screen.queryByRole('button', { name: /sign up/i });
      expect(button).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('enables button when password and passwordrepeat input has the same value', () => {
      render(<SignUpPage />);

      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatInput = screen.getByLabelText(/password repeat/i);

      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');

      const button = screen.queryByRole('button', { name: /sign up/i });
      expect(button).toBeEnabled();
    });

    it('sends username, email and password to backend after clicking the button', async () => {
      render(<SignUpPage />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatInput = screen.getByLabelText(/password repeat/i);
      userEvent.type(usernameInput, 'user1');
      userEvent.type(emailInput, 'user1@mail.com');
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');

      const button = screen.getByRole('button', { name: /sign up/i });
      expect(button).toBeEnabled();

      const mockFn = jest.fn();
      axios.post = mockFn;

      if (!button) return;

      userEvent.click(button);

      // mock the first call of axios
      const firstCallOfMockFunction = mockFn.mock.calls[0];

      // axios.post(<0>,<1>) === axios.post('http://...', body)
      // getting the body of the axios mock
      const body = firstCallOfMockFunction[1];

      expect(body).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });
  });
});
