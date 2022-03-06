import React from 'react';
import LanguageSelector from './components/LanguageSelector';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UserPage from './pages/UserPage';
import { Route, Routes } from 'react-router-dom';
import AccountActivationPage from './pages/AccountActivationPage';
import NavBar from './components/NavBar';

function App(): React.ReactElement {
  // const [path, setPath] = useState<string>(window.location.pathname);

  // const onClickLink = (event: NewType) => {
  //   event.preventDefault();
  //   const pathValue = event.currentTarget.attributes.href.value;

  //   window.history.pushState({}, '', pathValue);
  //   setPath(pathValue);
  // };

  return (
    <>
      <NavBar />
      <div className="container pt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/activate/:token" element={<AccountActivationPage />} />
        </Routes>
        {/* {path === '/' && <HomePage />}
        {path === '/signup' && <SignUpPage />}
        {path === '/login' && <LoginPage />}
        {path.startsWith('/user/') && <UserPage />} */}
        {/* <LanguageSelector /> */}
      </div>
    </>
  );
}

export default App;
