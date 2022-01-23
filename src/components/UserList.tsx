import React from 'react';
import { withTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
import { loadUsers } from '../api/apiCalls';
import Spinner from './Spinner';
import UserListItem from './UserListItem';

class UserList extends React.Component<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { children?: React.ReactElement; t: any; i18n: any },
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
    pendingApiCall: boolean;
  }
> {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
    pendingApiCall: false,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async (pageIndex?: number) => {
    this.setState({ pendingApiCall: true });
    try {
      const response = await loadUsers(pageIndex);
      const page = response.data;

      this.setState({ page: page });
    } catch (e) {
      //
    }
    this.setState({ pendingApiCall: false });
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
    const { pendingApiCall } = this.state;
    const { totalPages, page, content } = this.state.page;
    const { t } = this.props;

    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>{t('users')}</h3>
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
                // <li
                //   className="list-group-item list-group-item-action"
                //   key={user.id}
                // >
                //   <Link to={`user/${user.id}`}>{user.username}</Link>
                // </li>
                <UserListItem user={user} key={user.id} />
              );
            }
          )}
        </ul>
        <div className="card-footer">
          {page !== 0 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-start"
              onClick={() => {
                this.loadData(page - 1);
              }}
            >
              {/* &lt; previous */}
              {t('previousPage')}
            </button>
          )}
          {totalPages > page + 1 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-end"
              onClick={() => {
                this.loadData(page + 1);
              }}
            >
              {/* {'next >'} */}
              {t('nextPage')}
            </button>
          )}
          {pendingApiCall && <Spinner />}
        </div>
      </div>
    );
  }
}

export default withTranslation()(UserList);
