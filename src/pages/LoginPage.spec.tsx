/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import LoginPage from './LoginPage';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

let requestBody: { email: string; password: string };
let count: number;

// initialize mock server
const server = setupServer(
  rest.post<{ email: string; password: string }>(
    '/api/1.0/auth',
    (req, res, ctx) => {
      requestBody = req.body;

      count += 1;

      return res(
        ctx.status(401),
        ctx.json({ message: 'Incorrect credentials' })
      );
    }
  )
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  count = 0;
  server.resetHandlers();
});

describe('Login Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<LoginPage />);

      const header = screen.queryByRole('heading', { name: /login/i });

      expect(header).toBeInTheDocument();
    });

    it('has email input', () => {
      render(<LoginPage />);

      const input = screen.getByLabelText(/e-mail/i);
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('Password') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has Login button', () => {
      render(<LoginPage />);
      const button = screen.queryByRole('button', { name: /login/i });
      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', () => {
      render(<LoginPage />);
      const button = screen.queryByRole('button', { name: /login/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    let button: HTMLElement;
    let emailInput: HTMLElement;
    let passwordInput: HTMLElement;
    const setup = () => {
      render(<LoginPage />);

      emailInput = screen.getByLabelText('E-mail');
      passwordInput = screen.getByLabelText('Password');
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();

      userEvent.type(emailInput, 'user100@mail.com');
      userEvent.type(passwordInput, 'P4ssword');

      button = screen.getByRole('button', { name: 'Login' });
    };

    it('enables the button when email and password inputs are filled', async () => {
      setup();

      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('displays spinner during api call', async () => {
      setup();
      expect(screen.queryByTestId('spinner-loading')).not.toBeInTheDocument();

      userEvent.click(button);

      const spinner = screen.queryByTestId('spinner-loading');
      await waitForElementToBeRemoved(spinner);
    });

    it('sends email and password to backend after clicking the button', async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.getByTestId('spinner-loading');
      await waitForElementToBeRemoved(spinner);

      expect(requestBody).toEqual({
        email: 'user100@mail.com',
        password: 'P4ssword',
      });
    });

    it('disables the button when there is an api call', async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);
      const spinner = screen.getByTestId('spinner-loading');
      await waitForElementToBeRemoved(spinner);

      expect(count).toEqual(1);
    });

    it('displays authentication fail message', async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText('Incorrect credentials');
      expect(errorMessage).toBeInTheDocument();
    });

    it('clears authentication fail message when email field is changed', async () => {
      setup();

      userEvent.click(button);
      const errorMessage = await screen.findByText(/Incorrect credentials/);
      expect(errorMessage).toBeInTheDocument();

      userEvent.type(emailInput, 'new@mail.com');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('clears authentication fail message when password field is changed', async () => {
      setup();

      userEvent.click(button);
      const errorMessage = await screen.findByText(/Incorrect credentials/);
      expect(errorMessage).toBeInTheDocument();

      userEvent.type(passwordInput, 'P4ssword');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
