import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthInterface {
  isLoggedIn: boolean;
  id: string;
}

const initialState: AuthInterface = {
  isLoggedIn: false,
  id: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
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
