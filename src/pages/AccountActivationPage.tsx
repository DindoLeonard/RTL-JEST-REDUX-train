import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { activate } from '../api/apiCalls';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
useParams;

const AccountActivationPage = (): React.ReactElement => {
  const [result, setResult] = useState<string | undefined>();
  const { token } = useParams();

  useEffect(() => {
    let mounted = true;
    async function activateRequest() {
      try {
        setResult(undefined);

        if (token) {
          await activate(token);
          if (mounted) {
            setResult('success');
          }
        }
      } catch (e) {
        if (mounted) {
          setResult('fail');
        }
      }
    }

    activateRequest();
    return () => {
      mounted = false;
    };
  }, [token]);

  let content = (
    // <div className="alert alert-secondary text-center">
    <Alert type="secondary" center>
      <Spinner size="big" />
    </Alert>
  );

  if (result === 'success') {
    content = <Alert type="success">Account is activated</Alert>;
  } else if (result === 'fail') {
    content = <Alert type="danger">Activation failure</Alert>;
  }

  return <div data-testid="activation-page">{content}</div>;
};

export default AccountActivationPage;
