import React from 'react';
import LanguageSelector from './components/LanguageSelector';
import SignUpPage from './pages/SignUpPage';

function App(): React.ReactElement {
  return (
    <div className="container">
      <SignUpPage />
      <LanguageSelector />
    </div>
  );
}

export default App;
