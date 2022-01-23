import React from 'react';
import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import UserList from './UserList';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import en from '../locale/en.json';
import fil from '../locale/fil.json';
import LanguageSelector from './LanguageSelector';

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

    return res(ctx.status(200), ctx.json(getPage(page, size)));
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

const setup = () => {
  render(
    <BrowserRouter>
      <UserList />
      <LanguageSelector />
    </BrowserRouter>
  );
};

describe('User List', () => {
  describe('Interactions', () => {
    it('display three users in list', async () => {
      setup();

      const users = await screen.findAllByText(/user/);
      expect(users.length).toBe(3);
    });

    it('displays next page link', async () => {
      setup();

      const user1 = await screen.findByText('user1');
      expect(user1).toBeInTheDocument();

      const nextPageLink = screen.queryByText('next >');

      expect(nextPageLink).toBeInTheDocument();
    });

    it('displays next page after clicking next', async () => {
      setup();

      const user1 = await screen.findByText('user1');
      expect(user1).toBeInTheDocument();

      const nextPageLink = screen.getByText('next >');
      userEvent.click(nextPageLink);
      const firstUserOfPage2 = await screen.findByText('user4');
      expect(firstUserOfPage2).toBeInTheDocument();
    });

    it('hides next page link after last page', async () => {
      setup();

      const user1 = await screen.findByText('user1');
      expect(user1).toBeInTheDocument();

      const nextPageLink = screen.getByText('next >');
      userEvent.click(nextPageLink);
      const user4 = await screen.findByText('user4');
      expect(user4).toBeInTheDocument();

      const nextPageLink2 = screen.getByText('next >');
      userEvent.click(nextPageLink2);
      const user7 = await screen.findByText('user7');
      expect(user7).toBeInTheDocument();

      expect(screen.queryByText('next >')).not.toBeInTheDocument();
    });

    it('does not display the previous page link in the first page', async () => {
      setup();
      const user1 = await screen.findByText('user1');
      expect(user1).toBeInTheDocument();

      const previousPageLink = screen.queryByText('< previous');
      expect(previousPageLink).not.toBeInTheDocument();
    });

    it('displays the previous page link in the second page', async () => {
      setup();
      await screen.findByText('user1');

      const nextPageLink = screen.getByText('next >');
      expect(nextPageLink).toBeInTheDocument();

      userEvent.click(nextPageLink);
      const firstUserOfPage2 = await screen.findByText('user4');
      expect(firstUserOfPage2).toBeInTheDocument();

      const previousPageLink = screen.queryByText('< previous');
      expect(previousPageLink).toBeInTheDocument();
    });

    it('displays the previous page after clicking the previous page link', async () => {
      setup();

      const user1 = await screen.findByText('user1');
      expect(user1).toBeInTheDocument();

      const nextPageLink = screen.getByText('next >');
      expect(nextPageLink).toBeInTheDocument();

      userEvent.click(nextPageLink);
      const firstUserOfPage2 = await screen.findByText('user4');
      expect(firstUserOfPage2).toBeInTheDocument();

      const previousPageLink = screen.getByText('< previous');
      expect(previousPageLink).toBeInTheDocument();

      userEvent.click(previousPageLink);
      const firstUserOfFirstPage = await screen.findByText('user1');
      expect(firstUserOfFirstPage).toBeInTheDocument();
    });

    it('displays spinner during the api call is in progress', async () => {
      setup();

      const spinner = screen.getByTestId('spinner-loading');
      expect(spinner).toBeInTheDocument();
      await screen.findByText('user1');
    });
  });

  describe('Internationalization', () => {
    beforeEach(() => {
      server.use(
        rest.get('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getPage(1, 3)));
        })
      );
    });

    // now in global setup in the root "setupTest.ts"
    // afterEach(() => {
    //   act(() => {
    //     i18n.changeLanguage('en');
    //   });
    // });

    it('displays header and navigation links in filipino after selecting the language', async () => {
      setup();
      const user1 = await screen.findByText('user4');
      expect(user1).toBeInTheDocument();

      const filipinoLanguage = screen.getByTitle('Filipino');
      expect(filipinoLanguage).toBeInTheDocument();

      userEvent.click(filipinoLanguage);
      expect(screen.getByText(fil.users)).toBeInTheDocument();
      expect(screen.getByText(fil.nextPage)).toBeInTheDocument();
      expect(screen.getByText(fil.previousPage)).toBeInTheDocument();
    });

    it('initially displays header and navigation links in english', async () => {
      setup();
      const user = await screen.findByText('user4');
      expect(user).toBeInTheDocument();
      expect(screen.getByText(en.users)).toBeInTheDocument();
      expect(screen.getByText(en.nextPage)).toBeInTheDocument();
      expect(screen.getByText(en.previousPage)).toBeInTheDocument();
    });
  });
});
