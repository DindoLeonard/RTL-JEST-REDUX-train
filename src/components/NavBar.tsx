import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import logo from '../assets/hoaxify.png';

const NavBar = (): React.ReactElement => {
  const { t } = useTranslation();

  const auth = useContext(AuthContext);

  return (
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
          {auth && !auth.isLoggedIn && (
            <>
              <Link className="nav-link" to="/signup">
                {t('signUp')}
              </Link>
              <Link className="nav-link" to="/login">
                {t('login')}
              </Link>
            </>
          )}
          {auth && auth.isLoggedIn && (
            <Link className="nav-link" to={`/user/${auth.id}`}>
              My Profile
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
