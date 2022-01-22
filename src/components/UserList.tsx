import React from 'react';
import { Link } from 'react-router-dom';
import { loadUsers } from '../api/apiCalls';

class UserList extends React.Component<
  { children?: React.ReactElement },
  {
    page: {
      content: {
        id: number;
        username: string;
        email: string;
        image: string | null;
      }[];
      page: number;
      size: number;
      totalPages: number;
    };
  }
> {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async (pageIndex?: number) => {
    try {
      const response = await loadUsers(pageIndex);
      this.setState({ page: response.data });
    } catch (e) {
      //
    }
  };

  // loadNext = () => {
  //   loadUsers(this.state.page.page + 1).then((response) => {
  //     this.setState({ page: response.data });
  //   });
  // };

  // loadPrevious = () => {
  //   loadUsers(this.state.page.page - 1).then((response) => {
  //     this.setState({ page: response.data });
  //   });
  // };

  render() {
    const { totalPages, page, content } = this.state.page;

    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        <ul className="list-group list-group-flush">
          {content.map(
            (user: {
              id: number;
              username: string;
              email: string;
              image: string | null;
            }) => {
              return (
                <li
                  className="list-group-item list-group-item-action"
                  key={user.id}
                >
                  <Link to={`user/${user.id}`}>{user.username}</Link>
                </li>
              );
            }
          )}
        </ul>
        <div className="card-footer">
          {page !== 0 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                this.loadData(page - 1);
              }}
            >
              &lt; previous
            </button>
          )}
          {totalPages > page + 1 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                this.loadData(page + 1);
              }}
            >
              {'next >'}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default UserList;
