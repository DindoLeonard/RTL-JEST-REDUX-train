import React, { useState, createContext } from 'react';
import LanguageSelector from './components/LanguageSelector';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UserPage from './pages/UserPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountActivationPage from './pages/AccountActivationPage';
import NavBar from './components/NavBar';

export const AuthContext = createContext<
  | {
      isLoggedIn: boolean;
      id: string;
      onLoginSuccess: React.Dispatch<
        React.SetStateAction<{
          isLoggedIn: boolean;
          id: string;
        }>
      >;
    }
  | undefined
>(undefined);

function App(): React.ReactElement {
  const [auth, setAuth] = useState<{
    isLoggedIn: boolean;
    id: string;
  }>({ isLoggedIn: false, id: '' });

  // const [path, setPath] = useState<string>(window.location.pathname);

  // const onClickLink = (event: NewType) => {
  //   event.preventDefault();
  //   const pathValue = event.currentTarget.attributes.href.value;

  //   window.history.pushState({}, '', pathValue);
  //   setPath(pathValue);
  // };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: auth.isLoggedIn,
        id: auth.id,
        onLoginSuccess: setAuth,
      }}
    >
      <BrowserRouter>
        <NavBar auth={auth} />
        <div className="container pt-3">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/login"
              element={
                <LoginPage
                  onLoginSuccess={(prop) => {
                    setAuth(prop);
                  }}
                />
              }
            />
            <Route path="/user/:id" element={<UserPage auth={auth} />} />
            <Route
              path="/activate/:token"
              element={<AccountActivationPage />}
            />
          </Routes>
          {/* {path === '/' && <HomePage />}
        {path === '/signup' && <SignUpPage />}
        {path === '/login' && <LoginPage />}
        {path.startsWith('/user/') && <UserPage />} */}
          <LanguageSelector />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
