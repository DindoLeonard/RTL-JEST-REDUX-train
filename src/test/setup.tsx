import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthContextWrapper from '../state/AuthContextWrapper';
import { Provider } from 'react-redux';
import store from '../store/store';

const RootWrapper = ({ children }: { children: React.ReactElement }) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthContextWrapper>{children}</AuthContextWrapper>
      </Provider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: RootWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
