import React from 'react';
import { findAllByText, render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import UserList from './UserList';

const page1 = {
  content: [
    {
      id: 1,
      username: 'user1',
      email: 'user1@mail.com',
      image: null,
    },
    {
      id: 2,
      username: 'user2',
      email: 'user2@mail.com',
      image: null,
    },
    {
      id: 3,
      username: 'user3',
      email: 'user3@mail.com',
      image: null,
    },
    {
      id: 4,
      username: 'user4',
      email: 'user4@mail.com',
      image: null,
    },
    {
      id: 5,
      username: 'user5',
      email: 'user5@mail.com',
      image: null,
    },
    {
      id: 6,
      username: 'user6',
      email: 'user6@mail.com',
      image: null,
    },
    {
      id: 7,
      username: 'user7',
      email: 'user7@mail.com',
      image: null,
    },
  ],
  page: 0,
  size: 3,
  totalPages: 9,
};

const users = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@mail.com',
    image: null,
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@mail.com',
    image: null,
  },
  {
    id: 3,
    username: 'user3',
    email: 'user3@mail.com',
    image: null,
  },
  {
    id: 4,
    username: 'user4',
    email: 'user4@mail.com',
    image: null,
  },
  {
    id: 5,
    username: 'user5',
    email: 'user5@mail.com',
    image: null,
  },
  {
    id: 6,
    username: 'user6',
    email: 'user6@mail.com',
    image: null,
  },
  {
    id: 7,
    username: 'user7',
    email: 'user7@mail.com',
    image: null,
  },
];

const getPage = (page: number, size: number) => {
  const start = page * size;
  const end = start + size;
  const totalPages = Math.ceil(users.length / size);

  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

// initialize mock server
const server = setupServer(
  rest.get('/api/1.0/users', (req, res, ctx) => {
    let page = Number.parseInt(req.url.searchParams.get('page') as string);
    let size = Number.parseInt(req.url.searchParams.get('size') as string);
    if (Number.isNaN(page)) {
      page = 0;
    }

    if (Number.isNaN(size)) {
      size = 5;
    }

    return res(ctx.status(200), ctx.json(getPage(0, 3)));
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

describe('User List', () => {
  test.only('display three users in list', async () => {
    render(<UserList />);

    const users = await screen.findAllByText(/user/);
    expect(users.length).toBe(3);
  });
});
