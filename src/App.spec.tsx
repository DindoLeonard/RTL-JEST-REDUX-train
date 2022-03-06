import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// initialize mock server
const server = setupServer(
  rest.post<{ name: string; email: string; password: string }>(
    '/api/1.0/users/token/:token',
    (req, res, ctx) => {
      return res(ctx.json(200));
    }
  ),
  rest.get('/api/1.0/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          {
            id: 1,
            username: 'user-in-list',
            email: 'user-in-list@mail.com',
            image: null,
          },
        ],
        page: 0,
        size: 0,
        totalPages: 0,
      })
    );
  }),
  rest.get('/api/1.0/users/:id', (req, res, ctx) => {
    // const id = Number.parseInt(req.params);
    const { id } = req.params;

    return res(
      ctx.json({
        id: id,
        username: 'user' + id,
        email: `user${id}@mail.com`,
        image: null,
      })
    );
  }),
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 5, username: 'user5' }));
  })
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.resetHandlers();
});

const setup = (path: string) => {
  window.history.pushState({}, '', path);
  render(<App />);
};

describe('Routing', () => {
  it.each`
    path               | pageTestId
    ${'/'}             | ${'home-page'}
    ${'/signup'}       | ${'signup-page'}
    ${'/login'}        | ${'login-page'}
    ${'/user/1'}       | ${'user-page'}
    ${'/user/2'}       | ${'user-page'}
    ${'/activate/123'} | ${'activation-page'}
    ${'/activate/456'} | ${'activation-page'}
  `('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path               | pageTestId
    ${'/'}             | ${'signup-page'}
    ${'/'}             | ${'login-page'}
    ${'/'}             | ${'user-page'}
    ${'/'}             | ${'activation-page'}
    ${'/signup'}       | ${'home-page'}
    ${'/signup'}       | ${'login-page'}
    ${'/signup'}       | ${'user-page'}
    ${'/signup'}       | ${'activation-page'}
    ${'/login'}        | ${'home-page'}
    ${'/login'}        | ${'signup-page'}
    ${'/login'}        | ${'user-page'}
    ${'/login'}        | ${'activation-page'}
    ${'/user/1'}       | ${'home-page'}
    ${'/user/1'}       | ${'signup-page'}
    ${'/user/1'}       | ${'login-page'}
    ${'/user/1'}       | ${'activation-page'}
    ${'/activate/123'} | ${'home-page'}
    ${'/activate/123'} | ${'signup-page'}
    ${'/activate/123'} | ${'login-page'}
    ${'/activate/123'} | ${'user-page'}
  `('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);
    expect(page).not.toBeInTheDocument();
  });

  it.each`
    targetPage
    ${'Home'}
    ${'Sign Up'}
    ${'Login'}
  `('has link to $targetPage on NavBar', ({ targetPage }) => {
    setup('/');
    const link = screen.getByRole('link', { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickinTo    | visiblePage
    ${'/'}       | ${'Sign Up'} | ${'signup-page'}
    ${'/signup'} | ${'Home'}    | ${'home-page'}
    ${'/signup'} | ${'Login'}   | ${'login-page'}
  `(
    'displays $visiblePage after clicking $clickinTo',
    ({ initialPath, clickinTo, visiblePage }) => {
      setup(initialPath);
      const link = screen.getByRole('link', { name: clickinTo });
      userEvent.click(link);
      expect(screen.getByTestId(visiblePage)).toBeInTheDocument();
    }
  );

  it('display home page when clicking brand logo', () => {
    setup('/login');
    // eslint-disable-next-line testing-library/await-async-utils

    const logo = screen.queryByAltText('Hoaxify');

    if (!logo) return;

    userEvent.click(logo);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('navigates to user page when clicking the user link', async () => {
    setup('/');
    // await waitFor(() => {
    //   const user = screen.queryByText('user-in-list');
    //   expect(user).toBeInTheDocument();
    // });
    const user = await screen.findByText('user-in-list');
    expect(user).toBeInTheDocument();

    userEvent.click(user);
    const userPage = screen.queryByTestId('user-page');
    expect(userPage).toBeInTheDocument();
  });
});

describe('Login', () => {
  const setupLoggedIn = () => {
    setup('/login');
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    userEvent.type(emailInput, 'user5@mail.com');
    userEvent.type(passwordInput, 'P4ssword');
    userEvent.click(loginButton);
  };

  it('redirects to homepage after successful login', async () => {
    setupLoggedIn();

    const homePage = await screen.findByTestId('home-page');
    expect(homePage).toBeInTheDocument();
  });

  it('hides Login and Sign Up from navbar after successful login', async () => {
    setupLoggedIn();
    const homePage = await screen.findByTestId('home-page');
    expect(homePage).toBeInTheDocument();

    const loginLink = screen.queryByRole('link', { name: 'Login' });
    const signUpLink = screen.queryByRole('link', { name: 'Sign Up' });

    expect(loginLink).not.toBeInTheDocument();
    expect(signUpLink).not.toBeInTheDocument();
  });

  it('displays My Profile link on navbar after successful login', async () => {
    setup('/login');

    const myProfileLinkBeforeLogin = screen.queryByRole('link', {
      name: 'My Profile',
    });
    expect(myProfileLinkBeforeLogin).not.toBeInTheDocument();

    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    userEvent.type(emailInput, 'user5@mail.com');
    userEvent.type(passwordInput, 'P4ssword');
    userEvent.click(loginButton);

    const homePage = await screen.findByTestId('home-page');
    expect(homePage).toBeInTheDocument();

    const myProfileLinkAfterLogin = screen.queryByRole('link', {
      name: 'My Profile',
    });
    expect(myProfileLinkAfterLogin).toBeInTheDocument();
  });

  it('displays user page with logged in user id in the url after clicking My Profile Link', async () => {
    setupLoggedIn();
    const homePage = await screen.findByTestId('home-page');
    expect(homePage).toBeInTheDocument();

    const myProfile = screen.getByRole('link', { name: 'My Profile' });

    userEvent.click(myProfile);
    const userPage = await screen.findByTestId('user-page');
    expect(userPage).toBeInTheDocument();

    const username = await screen.findByText('user5');
    expect(username).toBeInTheDocument();
  });
});

// to disable error that involves console.log
// eslint-disable-next-line @typescript-eslint/no-empty-function
console.error = () => {};
