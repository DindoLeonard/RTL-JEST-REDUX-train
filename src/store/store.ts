import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import storage from './storage';
// ...

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

store.subscribe(() => {
  const storeAuthState = store.getState().auth;
  // const stringifiedAuthState = JSON.stringify(storeAuthState);

  storage.setItem('auth', storeAuthState);
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
