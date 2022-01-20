import React from 'react';
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
    loadUsers().then((response) => {
      this.setState({ page: response.data });
    });
  }

  render() {
    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        <ul className="list-group list-group-flush">
          {this.state.page.content.map(
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
                  {user.username}
                </li>
              );
            }
          )}
        </ul>
      </div>
    );
  }
}

export default UserList;
