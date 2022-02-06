import React from 'react';
import Input from '../components/Input';
import { withTranslation } from 'react-i18next';
import { signUp } from '../api/apiCalls';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import ButtonWithProgress from '../components/ButtonWithProgress';

class SignUpPage extends React.Component<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { children?: React.ReactElement; t: any; i18n: any },
  {
    username: string;
    email: string;
    password: string;
    passwordRepeat: string;
    apiProgress: boolean;
    signUpSuccess: boolean;
    errors: { username: string; password: string; email: string };
  }
> {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    apiProgress: false,
    signUpSuccess: false,
    errors: { username: '', password: '', email: '' },
  };

  onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    // deep copy of nested object
    const errorsCopy = JSON.parse(JSON.stringify({ ...this.state.errors }));
    delete errorsCopy['username'];

    this.setState({ username: e.target.value, errors: errorsCopy });
  };

  onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const errorsCopy = JSON.parse(JSON.stringify({ ...this.state.errors }));
    delete errorsCopy['email'];
    this.setState({ email: e.target.value, errors: errorsCopy });
  };

  onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const errorsCopy = JSON.parse(JSON.stringify({ ...this.state.errors }));
    delete errorsCopy['password'];
    this.setState({ password: e.target.value, errors: errorsCopy });
  };

  onChangePasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const errorsCopy = JSON.parse(JSON.stringify({ ...this.state.errors }));
    delete errorsCopy['password'];
    this.setState({ passwordRepeat: e.target.value, errors: errorsCopy });
  };

  submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { username, email, password } = this.state;

    this.setState({ apiProgress: true });

    try {
      const body = { username, email, password };

      await signUp(body);

      this.setState({ signUpSuccess: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // console.log(e);
      this.setState({ apiProgress: false });
      if (e.response.status === 400) {
        this.setState({ errors: e.response.data.validationErrors });
      }
    }

    // FETCH API
    // await fetch('/api/v1/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ username, email, password }),
    // });
  };

  render() {
    const { t } = this.props;
    const { password, passwordRepeat, apiProgress, signUpSuccess, errors } =
      this.state;

    let disabled = true;

    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }

    const passwordMismatch =
      password !== passwordRepeat ? t('passwordMismatchValidation') : '';

    return (
      <div
        className="col-lg-6  offset-lg-3 col-md-8 offset-md-2"
        data-testid="signup-page"
      >
        {!signUpSuccess && (
          <form className="card " data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">{t('signUp')}</h1>
            </div>
            <div className="card-body">
              <Input
                label={t('username')}
                id="username"
                onChange={this.onChangeUsername}
                help={errors.username}
              />
              <Input
                label={t('email')}
                id="email"
                onChange={this.onChangeEmail}
                help={errors.email}
              />
              <Input
                label={t('password')}
                id="password"
                onChange={this.onChangePassword}
                help={errors.password}
                type="password"
              />
              <Input
                label={t('passwordRepeat')}
                id="password repeat"
                onChange={this.onChangePasswordRepeat}
                help={passwordMismatch}
                type="password"
              />
              {/* <div className="mb-3">
                <label htmlFor="passwordRepeat" className="form-label">
                  Password Repeat
                </label>
                <input
                  id="passwordRepeat"
                  placeholder="password repeat"
                  type="password"
                  className="form-control"
                  onChange={this.onChangePasswordRepeat}
                />
              </div> */}
              <div className="text-center">
                {/* <button
                  disabled={disabled || apiProgress}
                  onClick={this.submit}
                  className="btn btn-primary"
                >
                  {apiProgress && (
                    // <span
                    //   className="spinner-border spinner-border-sm"
                    //   role="status"
                    //   aria-hidden="true"
                    // ></span>
                    <Spinner />
                  )}
                  {t('signUp')}
                </button> */}
                <ButtonWithProgress
                  disabled={disabled}
                  apiProgress={apiProgress}
                  onClick={this.submit}
                >
                  {t('signUp')}
                </ButtonWithProgress>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <Alert
          // type="success"
          // text="Please check your e-mail to activate your account"
          >
            Please check your e-mail to activate your account
          </Alert>
        )}
      </div>
    );
  }
}

const SignUpPageWithTranslation = withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
