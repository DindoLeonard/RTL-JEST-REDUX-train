import React from 'react';
import defaultImageProfile from '../assets/profile.png';

type IProps = {
  user: { id: number; username: string; email: string; image: string | null };
};

const ProfileCard = (props: IProps): React.ReactElement => {
  const { user } = props;
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
    </div>
  );
};

export default ProfileCard;
