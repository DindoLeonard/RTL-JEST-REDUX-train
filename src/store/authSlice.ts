import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from './storage';

interface AuthInterface {
  isLoggedIn: boolean;
  id: string;
  username: string;
  image: string | null;
  header: string;
}

// const isLoggedIn = JSON.parse(localStorage.getItem('auth') as string);
const initialState = storage.getItem('auth');

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState || { isLoggedIn: false, id: '' },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<AuthInterface>) => {
      state.isLoggedIn = true;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.image = action.payload.image;
      state.header = action.payload.header;
    },
  },
});

export const { setIsLoggedIn } = authSlice.actions;

export default authSlice.reducer;
