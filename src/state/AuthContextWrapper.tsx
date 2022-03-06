import React, { useState, createContext } from 'react';
import LanguageSelector from '../components/LanguageSelector';

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

function AuthContextWrapper(props: {
  children: React.ReactElement;
}): React.ReactElement {
  const [auth, setAuth] = useState<{
    isLoggedIn: boolean;
    id: string;
  }>({ isLoggedIn: false, id: '' });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: auth.isLoggedIn,
        id: auth.id,
        onLoginSuccess: setAuth,
      }}
    >
      {props.children}
      <LanguageSelector />
    </AuthContext.Provider>
  );
}

export default AuthContextWrapper;
