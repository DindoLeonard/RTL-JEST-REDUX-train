import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UserPage from './pages/UserPage';
import { useTranslation } from 'react-i18next';
import logo from './assets/hoaxify.png';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import AccountActivationPage from './pages/AccountActivationPage';

function App(): React.ReactElement {
  const { t } = useTranslation();
  // const [path, setPath] = useState<string>(window.location.pathname);

  // const onClickLink = (event: NewType) => {
  //   event.preventDefault();
  //   const pathValue = event.currentTarget.attributes.href.value;

  //   window.history.pushState({}, '', pathValue);
  //   setPath(pathValue);
  // };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/" title="Home">
            <img src={logo} alt="Hoaxify" width="60" />
            Hoaxify
          </Link>
          {/* <a
            className="navbar-brand"
            href="/"
            title="Home"
            onClick={onClickLink}
          >
            <img src={logo} alt="Hoaxify" width="60" />
            Hoaxify
          </a> */}
          <ul className="navbar-nav">
            <Link className="nav-link" to="/signup">
              {t('signUp')}
            </Link>
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </ul>
        </div>
      </nav>
      <div className="container pt-3">
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/activate/:token" element={<AccountActivationPage />} />
        </Routes>
        {/* {path === '/' && <HomePage />}
        {path === '/signup' && <SignUpPage />}
        {path === '/login' && <LoginPage />}
        {path.startsWith('/user/') && <UserPage />} */}
        <LanguageSelector />
      </div>
    </BrowserRouter>
  );
}

export default App;
