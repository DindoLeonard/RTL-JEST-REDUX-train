import React from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImageProfile from '../assets/profile.png';

type UserPropsType = {
  user: {
    id: number;
    username: string;
    email: string;
    image: null | string;
  };
};

const UserListItem = (props: UserPropsType): React.ReactElement => {
  const { user } = props;
  const navigate = useNavigate();
  return (
    <li
      className="list-group-item list-group-item-action"
      key={user.id}
      onClick={() => {
        navigate(`user/${user.id}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* <Link to={`user/${user.id}`}>{user.username}</Link> */}
      <img
        src={defaultImageProfile}
        alt="profile"
        width={30}
        className="rounded-circle shadow-sm"
      />
      {user.username}
    </li>
  );
};

export default UserListItem;
