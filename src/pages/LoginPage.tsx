import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/apiCalls';
import Alert from '../components/Alert';
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from '../components/Input';
import { setIsLoggedIn } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
// import Spinner from '../components/Spinner';

// type IProps = {
//   onLoginSuccess: ({
//     isLoggedIn,
//     id,
//   }: {
//     isLoggedIn: boolean;
//     id: string;
//   }) => void;
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginPage = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<undefined | string>(undefined);
  const [password, setPassword] = useState<undefined | string>(undefined);
  const [apiProgress, setApiProgress] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<undefined | string>(undefined);
  const { t } = useTranslation();

  // const auth = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    setFailMessage(undefined);
  }, [email, password]);

  const disabled = !(email && password);

  const submit = async (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();
      setApiProgress(true);

      const response = await login({
        email: email as string,
        password: password as string,
      });

      // const auth = {
      //   isLoggedIn: true,
      //   id: response.data.id as string,
      // };

      navigate('/');
      // auth?.onLoginSuccess({
      //   isLoggedIn: true,
      //   id: response.data.id,
      // });
      dispatch(setIsLoggedIn({ isLoggedIn: true, id: response.data.id }));

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
          <h1 className="text-center">{t('login')}</h1>
        </div>
        <div className="card-body">
          <Input
            label={t('email')}
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label={t('password')}
            id="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          {failMessage && <Alert type="danger">{failMessage}</Alert>}

          <div className="text-center">
            {/* <button
              disabled={disabled || apiProgress}
              className="btn btn-primary"
              onClick={submit}
            >
              {apiProgress && <Spinner />}
              {t('login')}
            </button> */}
            <ButtonWithProgress
              disabled={disabled}
              apiProgress={apiProgress}
              onClick={submit}
            >
              {t('login')}
            </ButtonWithProgress>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
