import axios from 'axios';
import React from 'react';

class SignUpPage extends React.Component<
  { children?: React.ReactElement },
  { username: string; email: string; password: string; passwordRepeat: string }
> {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
  };

  onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: e.target.value });
  };

  onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  onChangePasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ passwordRepeat: e.target.value });
  };

  submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { username, email, password } = this.state;
    await axios.post('/api/v1/users', { username, email, password });
  };

  render() {
    const { password, passwordRepeat } = this.state;

    let disabled = true;

    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }

    return (
      <div>
        <h1>Sign Up</h1>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="username"
          onChange={this.onChangeUsername}
        />
        <label htmlFor="email">E-mail</label>
        <input id="email" placeholder="email" onChange={this.onChangeEmail} />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder="password"
          type="password"
          onChange={this.onChangePassword}
        />
        <label htmlFor="passwordRepeat">Password Repeat</label>
        <input
          id="passwordRepeat"
          placeholder="passwordRepeat"
          type="password"
          onChange={this.onChangePasswordRepeat}
        />
        <button disabled={disabled} onClick={this.submit}>
          Sign up
        </button>
      </div>
    );
  }
}

export default SignUpPage;
