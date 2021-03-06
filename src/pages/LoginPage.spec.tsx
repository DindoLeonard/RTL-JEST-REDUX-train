/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react';
// import {
//   act,
//   render,
//   screen,
//   waitForElementToBeRemoved,
// } from '@testing-library/react';
import { act, render, screen, waitForElementToBeRemoved } from '../test/setup';
import LoginPage from './LoginPage';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import LanguageSelector from '../components/LanguageSelector';
import i18n from '../locale/i18n';
import en from '../locale/en.json';
import fil from '../locale/fil.json';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import storage from '../store/storage';

let requestBody: { email: string; password: string };
let count: number;
let acceptLanguageHeader: string | null;

// initialize mock server
const server = setupServer(
  rest.post<{ email: string; password: string }>(
    '/api/1.0/auth',
    (req, res, ctx) => {
      requestBody = req.body;

      count += 1;

      acceptLanguageHeader = req.headers.get('Accept-Language');

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

const loginSuccess = rest.post('/api/1.0/auth', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      id: 5,
      username: 'user5',
      image: null,
      token: 'abcdefgh',
    })
  );
});

describe('Login Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<LoginPage />);
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route path={'/login'} element={<LoginPage />} />
      //     </Routes>
      //   </MemoryRouter>
      // );

      const header = screen.queryByRole('heading', { name: /login/i });

      expect(header).toBeInTheDocument();
    });

    it('has email input', () => {
      render(<LoginPage />);
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route path={'/login'} element={<LoginPage />} />
      //     </Routes>
      //   </MemoryRouter>
      // );

      const input = screen.getByLabelText(/e-mail/i);
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<LoginPage />);
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route path={'/login'} element={<LoginPage />} />
      //     </Routes>
      //   </MemoryRouter>
      // );
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for input', () => {
      render(<LoginPage />);
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route path={'/login'} element={<LoginPage />} />
      //     </Routes>
      //   </MemoryRouter>
      // );
      const input = screen.getByLabelText('Password') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has Login button', () => {
      render(<LoginPage />);
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route path={'/login'} element={<LoginPage />} />
      //     </Routes>
      //   </MemoryRouter>
      // );
      const button = screen.queryByRole('button', { name: /login/i });
      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', () => {
      render(<LoginPage />);
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route path={'/login'} element={<LoginPage />} />
      //     </Routes>
      //   </MemoryRouter>
      // );
      const button = screen.queryByRole('button', { name: /login/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    let button: HTMLElement;
    let emailInput: HTMLElement;
    let passwordInput: HTMLElement;
    const setup = (email = 'user100@mail.com') => {
      render(<LoginPage />);
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route path={'/login'} element={<LoginPage />} />
      //     </Routes>
      //   </MemoryRouter>
      // );

      emailInput = screen.getByLabelText('E-mail');
      passwordInput = screen.getByLabelText('Password');
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();

      userEvent.type(emailInput, email);
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

    it('stores id, username and image in storage', async () => {
      server.use(loginSuccess);

      setup('user5@mail.com');

      userEvent.click(button);

      const spinner = screen.getByTestId('spinner-loading');

      await waitForElementToBeRemoved(spinner);

      // check storage
      const storedState = storage.getItem('auth');

      const objectFields = Object.keys(storedState);

      expect(objectFields.includes('id')).toBeTruthy();
      expect(objectFields.includes('username')).toBeTruthy();
      expect(objectFields.includes('image')).toBeTruthy();
    });

    it('stores authorization header value in storage', async () => {
      server.use(loginSuccess);

      setup('user5@mail.com');

      userEvent.click(button);

      const spinner = screen.getByTestId('spinner-loading');

      await waitForElementToBeRemoved(spinner);

      // check storage
      const storedState = storage.getItem('auth');

      expect(storedState.header).toBe('Bearer abcdefgh');
    });
  });

  describe('Internationalization', () => {
    let filipinoToggle: HTMLElement;
    let englishToggle: HTMLElement;

    const setup = () => {
      // render(
      //   <>
      //     <LoginPage  />
      //     <LanguageSelector />
      //   </>
      // );
      // render(
      //   <MemoryRouter initialEntries={['/login']}>
      //     <Routes>
      //       <Route
      //         path={'/login'}
      //         element={
      //           <>
      //             <LoginPage />
      //             <LanguageSelector />
      //           </>
      //         }
      //       />
      //     </Routes>
      //   </MemoryRouter>
      // );
      render(<LoginPage />);

      filipinoToggle = screen.getByTitle('Filipino');
      englishToggle = screen.getByTitle('English');
    };

    afterEach(() => {
      act(() => {
        i18n.changeLanguage('en');
      });
    });

    it('initially displays all text in English', () => {
      setup();

      const header = screen.getByRole('heading', { name: en.login });
      expect(header).toBeInTheDocument();

      const button = screen.getByRole('button', { name: en.login });
      expect(button).toBeInTheDocument();

      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
    });

    it('displays all text in Filipino after changing the language', async () => {
      setup();
      userEvent.click(filipinoToggle);

      const header = screen.getByRole('heading', { name: fil.login });
      expect(header).toBeInTheDocument();
      const button = screen.getByRole('button', { name: fil.login });
      expect(button).toBeInTheDocument();
      expect(screen.getByLabelText(fil.email)).toBeInTheDocument();
      expect(screen.getByLabelText(fil.password)).toBeInTheDocument();
    });

    it('sets accept language header to en for outgoing message', async () => {
      setup();
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();

      userEvent.type(emailInput, 'user100@mail.com');
      userEvent.type(passwordInput, 'P4ssword');

      const button = screen.getByRole('button', { name: 'Login' });

      userEvent.click(englishToggle);
      userEvent.click(button);
      const spinner = screen.getByTestId('spinner-loading');
      await waitForElementToBeRemoved(spinner);

      expect(acceptLanguageHeader).toBe('en');
    });

    it('sets accept language header to tr for outgoing request', async () => {
      setup();
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();

      userEvent.type(emailInput, 'user100@mail.com');
      userEvent.type(passwordInput, 'P4ssword');

      const button = screen.getByRole('button', { name: 'Login' });

      userEvent.click(filipinoToggle);
      userEvent.click(button);
      const spinner = screen.getByTestId('spinner-loading');
      await waitForElementToBeRemoved(spinner);

      expect(acceptLanguageHeader).toBe('fil');
    });
  });
});
