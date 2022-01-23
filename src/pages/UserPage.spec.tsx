import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
// import AccountActivationPage from './AccountActivationPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import UserPage from './UserPage';

// initialize mock server
const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.resetHandlers();
});

describe('User Page', () => {
  beforeEach(() => {
    server.use(
      rest.get('/api/1.0/users/:id', (req, res, ctx) => {
        const { id } = req.params as { id: string };

        if (id === '1') {
          return res(
            ctx.json({
              id: 1,
              username: 'user1',
              email: 'user1@mail.com',
              image: null,
            })
          );
        } else {
          return res(ctx.status(404), ctx.json({ message: 'User not found' }));
        }
      })
    );
  });

  it('display user name on page when user is found', async () => {
    const id = 1;
    render(
      <MemoryRouter initialEntries={['/user/' + id.toString()]}>
        <Routes>
          <Route path={'/user/:id'} element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const user1 = screen.queryByText('user1');
      expect(user1).toBeInTheDocument();
    });
  });

  it('displays spinner while the api call is in progress', async () => {
    const id = 1;
    render(
      <MemoryRouter initialEntries={['/user/' + id.toString()]}>
        <Routes>
          <Route path={'/user/:id'} element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    );

    // spinner appear
    const spinner = screen.getByTestId('spinner-loading');
    expect(spinner).toBeInTheDocument();

    // user appear
    const user1 = await screen.findByText('user1');
    expect(user1).toBeInTheDocument();

    // spinner gone
    expect(spinner).not.toBeInTheDocument();
  });

  it('displays error message received from backend when the user is not found', async () => {
    const id = 100;
    render(
      <MemoryRouter initialEntries={['/user/' + id.toString()]}>
        <Routes>
          <Route path={'/user/:id'} element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const userNotFoundText = screen.queryByText('User not found');
      expect(userNotFoundText).toBeInTheDocument();
    });
  });
});
