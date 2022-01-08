import React from 'react';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <>
      <img
        title="Filipino"
        onClick={() => {
          i18n.changeLanguage('fil');
        }}
        src="https://flagcdn.com/w40/ph.png"
        width="24"
        alt="Philippines"
      />

      <img
        title="English"
        onClick={() => {
          i18n.changeLanguage('en');
        }}
        src="https://flagcdn.com/w40/us.png"
        width="24"
        alt="United States"
      />
    </>
  );
};

export default LanguageSelector;
