import React from 'react';

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <label htmlFor="username">Username</label>
      <input id="username" placeholder="username" />
      <label htmlFor="email">E-mail</label>
      <input id="email" placeholder="email" />
      <label htmlFor="password">Password</label>
      <input id="password" placeholder="password" type="password" />
      <label htmlFor="passwordRepeat">Password Repeat</label>
      <input id="passwordRepeat" placeholder="passwordRepeat" type="password" />
      <button disabled>Sign up</button>
    </div>
  );
};

export default SignUpPage;
