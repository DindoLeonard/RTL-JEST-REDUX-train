import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../api/apiCalls';
import Alert from '../components/Alert';
import ProfileCard from '../components/ProfileCard';
import Spinner from '../components/Spinner';

const UserPage = (props: {
  auth?: { isLoggedIn: boolean; id: string };
}): React.ReactElement => {
  const { id } = useParams();

  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    image: string | null;
  }>();

  const [pendingApiCall, setPendingApiCall] = useState<boolean>(false);

  const [failReponse, setFailResponse] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    let isMounted = true;

    const fetchUserById = async (id: string) => {
      setPendingApiCall(true);
      try {
        const response = await getUserById(id);
        if (isMounted) {
          // console.log(response.data);
          setUser(response.data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setFailResponse(e.response.data.message);
      }
      setPendingApiCall(false);
    };

    if (id) {
      fetchUserById(id);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  let content = (
    <Alert type="secondary" center>
      <Spinner size="big" />
    </Alert>
  );

  if (!pendingApiCall) {
    if (failReponse) {
      content = (
        <Alert type="danger" center>
          {failReponse}
        </Alert>
      );
    } else {
      if (user) {
        content = <ProfileCard user={user} />;
      }
    }
  }

  return (
    <div data-testid="user-page">
      {content}
      {/* {!pendingApiCall && user && <ProfileCard user={user} />}
      {pendingApiCall && (
        <Alert type="secondary" center>
          <Spinner size="big" />
        </Alert>
      )} */}
    </div>
  );
};

export default UserPage;
