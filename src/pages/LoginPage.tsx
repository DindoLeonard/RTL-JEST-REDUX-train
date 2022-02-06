import React, { useEffect, useState } from 'react';
import { login } from '../api/apiCalls';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Spinner from '../components/Spinner';

const LoginPage = (): React.ReactElement => {
  const [email, setEmail] = useState<undefined | string>(undefined);
  const [password, setPassword] = useState<undefined | string>(undefined);
  const [apiProgress, setApiProgress] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<undefined | string>(undefined);

  useEffect(() => {
    setFailMessage(undefined);
  }, [email, password]);

  const disabled = !(email && password);

  const submit = async (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();
      setApiProgress(true);

      await login({
        email: email as string,
        password: password as string,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      //
      setFailMessage(error.response.data.message);
      setApiProgress(false);
    }
    setApiProgress(false);
  };

  return (
    <div
      className="col-lg-6  offset-lg-3 col-md-8 offset-md-2"
      data-testid="login-page"
    >
      <form className="card ">
        <div className="card-header">
          <h1 className="text-center">Login</h1>
        </div>
        <div className="card-body">
          <Input
            label="E-mail"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          {failMessage && <Alert type="danger">{failMessage}</Alert>}

          <div className="text-center">
            <button
              disabled={disabled || apiProgress}
              className="btn btn-primary"
              onClick={submit}
            >
              {apiProgress && <Spinner />}
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
