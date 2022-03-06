import React, { useContext } from 'react';
import defaultImageProfile from '../assets/profile.png';
import { AuthContext } from '../state/AuthContextWrapper';

type IProps = {
  user: { id: number; username: string; email: string; image: string | null };
};

const ProfileCard = (props: IProps): React.ReactElement => {
  const { user } = props;
  const auth = useContext(AuthContext);

  return (
    <div className="card">
      <div className="card-header">
        <img
          src={defaultImageProfile}
          alt="profile"
          width="200"
          height="200"
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body">
        <h3>{user.username}</h3>
      </div>
      {auth && user.id === Number(auth.id) && <button>Edit</button>}
    </div>
  );
};

export default ProfileCard;
