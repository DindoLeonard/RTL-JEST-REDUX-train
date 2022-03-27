import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from './storage';

interface AuthInterface {
  isLoggedIn: boolean;
  id: string;
}

// const isLoggedIn = JSON.parse(localStorage.getItem('auth') as string);
const initialState = storage.getItem('auth') as AuthInterface;

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState || { isLoggedIn: false, id: '' },
  reducers: {
    setIsLoggedIn: (
      state,
      action: PayloadAction<{ isLoggedIn: boolean; id: string }>
    ) => {
      //
      state.isLoggedIn = action.payload.isLoggedIn;
      state.id = action.payload.id;
    },
  },
});

export const { setIsLoggedIn } = authSlice.actions;

export default authSlice.reducer;
