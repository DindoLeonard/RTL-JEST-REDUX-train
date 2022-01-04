/* eslint-disable testing-library/no-node-access */
import SignUpPage from './SignUpPage';
import { render, screen } from '@testing-library/react';

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
});
