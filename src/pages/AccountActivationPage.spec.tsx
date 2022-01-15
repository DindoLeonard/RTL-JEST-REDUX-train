import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountActivationPage from './AccountActivationPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

let counter = 0;

// initialize mock server
const server = setupServer(
  rest.post<{ name: string; email: string; password: string }>(
    '/api/1.0/users/token/:token',
    (req, res, ctx) => {
      const { token } = req.params;
      if (token === '5678') {
        return res(ctx.status(400));
      }
      counter += 1;
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

describe('AccountActivationPage', () => {
  const setup = (token: string) => {
    render(
      <MemoryRouter initialEntries={['/activation-page/' + token]}>
        <Routes>
          <Route
            path={'/activation-page/:token'}
            element={<AccountActivationPage />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('displays activation success message when token is valid', async () => {
    setup('123');

    const message = await screen.findByText('Account is activated');
    expect(message).toBeInTheDocument();
  });

  it('sends activation request to backend', async () => {
    setup('123');

    await screen.findByText('Account is activated');
    expect(counter).toBe(1);
  });

  it('displays activation failure message when token is invalid', async () => {
    setup('5678');

    const message = await screen.findByText('Activation failure');
    expect(message).toBeInTheDocument();
  });
});
