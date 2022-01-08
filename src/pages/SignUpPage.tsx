import axios from 'axios';
import React from 'react';
import Input from '../components/Input';

class SignUpPage extends React.Component<
  { children?: React.ReactElement },
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
      await axios.post('/api/1.0/users', {
        username,
        email,
        password,
      });

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
    const { password, passwordRepeat, apiProgress, signUpSuccess, errors } =
      this.state;

    let disabled = true;

    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }

    const passwordMismatch =
      password !== passwordRepeat ? 'Password mismatch' : '';

    return (
      <div className="col-lg-6  offset-lg-3 col-md-8 offset-md-2">
        {!signUpSuccess && (
          <form className="card mt-5 " data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">Sign Up</h1>
            </div>
            <div className="card-body">
              <Input
                label="Username"
                id="username"
                onChange={this.onChangeUsername}
                help={errors.username}
              />
              <Input
                label="E-mail"
                id="email"
                onChange={this.onChangeEmail}
                help={errors.email}
              />
              <Input
                label="Password"
                id="password"
                onChange={this.onChangePassword}
                help={errors.password}
                type="password"
              />
              <Input
                label="Password Repeat"
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
                <button
                  disabled={disabled || apiProgress}
                  onClick={this.submit}
                  className="btn btn-primary"
                >
                  {apiProgress && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Sign up
                </button>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <div className="alert alert-success mt-3">
            Please check your e-mail to activate your account
          </div>
        )}
      </div>
    );
  }
}

export default SignUpPage;
