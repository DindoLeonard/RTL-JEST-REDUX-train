import React from 'react';
import UserList from '../components/UserList';

const HomePage = (): React.ReactElement => {
  return (
    <div data-testid="home-page">
      <UserList />
    </div>
  );
};

export default HomePage;
