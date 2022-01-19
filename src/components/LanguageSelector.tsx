import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useHover from '../useHover';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LanguageSelector = (): React.ReactElement => {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const on = useHover(ref.current);

  let size = 24;
  if (on) {
    size = 48;
  }

  return (
    <div ref={ref}>
      <img
        title="Filipino"
        onClick={() => {
          i18n.changeLanguage('fil');
        }}
        src="https://flagcdn.com/w40/ph.png"
        width={size}
        alt="Philippines"
      />

      <img
        title="English"
        onClick={() => {
          i18n.changeLanguage('en');
        }}
        src="https://flagcdn.com/w40/us.png"
        width={size}
        alt="United States"
      />
    </div>
  );
};

export default LanguageSelector;
