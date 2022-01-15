import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { activate } from '../api/apiCalls';
useParams;

const AccountActivationPage = (): React.ReactElement => {
  const [result, setResult] = useState<string>();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      activate(token)
        .then(() => {
          setResult('success');
        })
        .catch(() => {
          setResult('fail');
        });
    }
  }, []);

  return (
    <div data-testid="activation-page">
      {result === 'success' && (
        <div className="alert alert-success mt-3">Account is activated</div>
      )}
      {result === 'fail' && (
        <div className="alert alert-danger mt-3">Activation failure</div>
      )}
    </div>
  );
};

export default AccountActivationPage;