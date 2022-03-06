import React from 'react';
import SignUpPage from './SignUpPage';
// import {
//   act,
//   render,
//   screen,
//   waitFor,
//   waitForElementToBeRemoved,
// } from '@testing-library/react';
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../test/setup';
import userEvent from '@testing-library/user-event';
// import axios from 'axios';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import '../locale/i18n';
import en from '../locale/en.json';
import fil from '../locale/fil.json';
import LanguageSelector from '../components/LanguageSelector';
import i18n from '../locale/i18n';

let counter = 0;
let requestBody: { email: string; name: string; password: string };
let acceptLanguageHeader: string | null;

// initialize mock server
const server = setupServer(
  rest.post<{ name: string; email: string; password: string }>(
    '/api/1.0/users',
    (req, res, ctx) => {
      // set requestBody variable to use in the expect by what it received in the actual post request
      requestBody = req.body;
      counter += 1;
      acceptLanguageHeader = req.headers.get('Accept-Language');
      return res(ctx.json(200));
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
  counter = 0;
  server.resetHandlers();
});

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

      const input = screen.getByLabelText(en.username);
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

  describe('Interactions', () => {
    let button: HTMLElement;
    let passwordInput: HTMLElement;
    let passwordRepeatInput: HTMLElement;
    let usernameInput: HTMLElement;
    let emailInput: HTMLElement;

    const setup = () => {
      render(<SignUpPage />);

      usernameInput = screen.getByLabelText('Username');
      emailInput = screen.getByLabelText('E-mail');
      passwordInput = screen.getByLabelText('Password');
      passwordRepeatInput = screen.getByLabelText(/password repeat/i);
      userEvent.type(usernameInput, 'user1');
      userEvent.type(emailInput, 'user1@mail.com');
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');

      // const button = screen.queryByRole('button', { name: /sign up/i });

      button = screen.getByRole('button', { name: /sign up/i });
    };

    it('enables button when password and passwordrepeat input has the same value', () => {
      setup();
      expect(button).toBeEnabled();
    });

    it('sends username, email and password to backend after clicking the button', async () => {
      setup();
      // const mockFn = jest.fn();
      // axios.post = mockFn;

      // FETCH API
      // window.fetch = mockFn;
      // userEvent.click(button);
      // const firstCallOfMockFunction = mockFn.mock.calls[0];
      // const body = JSON.parse(firstCallOfMockFunction[1].body);

      userEvent.click(button);

      // await new Promise((resolve) => setTimeout(resolve, 500));

      await screen.findByText(
        'Please check your e-mail to activate your account'
      );

      // AXIOS API
      // mock the first call of axios
      // const firstCallOfMockFunction = mockFn.mock.calls[0];
      // axios.post(<0>,<1>) === axios.post('http://...', body)
      // getting the body of the axios mock
      // const body = firstCallOfMockFunction[1];

      expect(requestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });

    it('disables button wheren there is an ongoing api call', async () => {
      setup();

      userEvent.click(button);
      userEvent.click(button);

      // await new Promise((resolve) => setTimeout(resolve, 500));

      await screen.findByText(
        'Please check your e-mail to activate your account'
      );

      expect(counter).toBe(1);
    });

    it('display spinner after clicking the submit', async () => {
      setup();

      const hiddenSpinner = screen.queryByRole('status');
      expect(hiddenSpinner).not.toBeInTheDocument();

      userEvent.click(button);

      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();

      await screen.findByText(
        'Please check your e-mail to activate your account'
      );
    });

    it('displays account activation notification after successful signup request', async () => {
      setup();

      const message = 'Please check your e-mail to activate your account';

      const textNotYetVisible = screen.queryByText(message);
      expect(textNotYetVisible).not.toBeInTheDocument();

      userEvent.click(button);

      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it('hides signup form after successful sign up request', async () => {
      setup();
      const form = screen.getByTestId('form-sign-up');
      userEvent.click(button);

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });

      // or
      // await waitForElementToBeRemoved(form);
    });

    const generateValidationError = (field: string, message: string) => {
      return rest.post('/api/1.0/users', (_req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: message },
          })
        );
      });
    };

    // IT EACH TABLE
    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
      ${'password'} | ${'Password cannot be null'}
    `('displays $message for $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message));

      setup();

      userEvent.click(button);

      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it('hides spinner and enables button after error response received', async () => {
      server.use(
        generateValidationError('username', 'Username cannot be null')
      );

      setup();

      userEvent.click(button);
      const validationError = await screen.findByText(
        'Username cannot be null'
      );

      expect(validationError).toBeInTheDocument();

      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('display mismatch message for password repeat input', () => {
      setup();
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'AnotherP4ssword');

      const validationError = screen.queryByText('Password mismatch');
      expect(validationError).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${'username'} | ${'Username cannot be null'} | ${'Username'}
      ${'email'}    | ${'E-mail cannot be null'}   | ${'E-mail'}
      ${'password'} | ${'Password cannot be null'} | ${'Password'}
    `(
      'clears validation error after $field is updated',
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));

        setup();

        userEvent.click(button);

        await waitFor(() => {
          const validationError = screen.queryByText(message);

          expect(validationError).toBeInTheDocument();
        });

        const inputComponent = screen.getByLabelText(label);

        userEvent.type(inputComponent, 'user1-updated');

        await waitFor(() => {
          const validationErrorSpan = screen.queryByText(message);
          expect(validationErrorSpan).not.toBeInTheDocument();
        });
      }
    );

    // it('clears validation error after username is updated', async () => {
    //   server.use(
    //     generateValidationError('username', 'Username cannot be null')
    //   );

    //   setup();

    //   userEvent.click(button);

    //   await waitFor(() => {
    //     const validationError = screen.queryByText('Username cannot be null');

    //     expect(validationError).toBeInTheDocument();
    //   });

    //   const inputComponent = screen.getByLabelText('Username');

    //   userEvent.type(inputComponent, 'user1-updated');
    //   const validationErrorSpan = screen.queryByText('Username cannot be null');
    //   expect(validationErrorSpan).not.toBeInTheDocument();
    // });
  });

  describe('Internationalization', () => {
    let filipinoToggle: HTMLElement;
    let englishToggle: HTMLElement;
    let passwordInput: HTMLElement;
    let passwordRepeatInput: HTMLElement;

    const setup = () => {
      render(
        <>
          <SignUpPage />
        </>
      );

      filipinoToggle = screen.getByTitle('Filipino');
      englishToggle = screen.getByTitle('English');
      passwordInput = screen.getByLabelText('Password');
      passwordRepeatInput = screen.getByLabelText('Password Repeat');
    };

    afterEach(() => {
      act(() => {
        i18n.changeLanguage('en');
      });
    });

    it('initially displays all text in English', () => {
      setup();

      const header = screen.getByRole('heading', { name: en.signUp });
      expect(header).toBeInTheDocument();

      const button = screen.getByRole('button', { name: en.signUp });
      expect(button).toBeInTheDocument();

      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('displays all text in Filipino after changing the language', async () => {
      setup();
      userEvent.click(filipinoToggle);

      const header = screen.getByRole('heading', { name: fil.signUp });
      expect(header).toBeInTheDocument();
      const button = screen.getByRole('button', { name: fil.signUp });
      expect(button).toBeInTheDocument();
      expect(screen.getByLabelText(fil.username)).toBeInTheDocument();
      expect(screen.getByLabelText(fil.email)).toBeInTheDocument();
      expect(screen.getByLabelText(fil.password)).toBeInTheDocument();
      expect(screen.getByLabelText(fil.passwordRepeat)).toBeInTheDocument();
    });

    it('displays all text in English after changing from Filipino', async () => {
      setup();

      userEvent.click(filipinoToggle);

      userEvent.click(englishToggle);

      const header = screen.getByRole('heading', { name: en.signUp });
      expect(header).toBeInTheDocument();
      const button = screen.getByRole('button', { name: en.signUp });
      expect(button).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('displays password mismatch validation in filipino', () => {
      setup();

      userEvent.click(filipinoToggle);

      userEvent.type(passwordInput, 'P4ss');

      const validationMessageInFilipino = screen.queryByText(
        fil.passwordMismatchValidation
      );

      expect(validationMessageInFilipino).toBeInTheDocument();
    });

    it('sends accept language header as en for outgoing request', async () => {
      setup();

      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');

      const button = screen.getByRole('button', { name: en.signUp });

      const form = screen.queryByTestId('form-sign-up');
      userEvent.click(button);
      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe('en');
    });

    it('sends accept language header as fil for outgoing request after selecting that language', async () => {
      setup();

      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');

      const button = screen.getByRole('button', { name: en.signUp });

      userEvent.click(filipinoToggle);

      const form = screen.queryByTestId('form-sign-up');
      userEvent.click(button);
      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe('fil');
    });
  });
});
