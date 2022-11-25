import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      userName: payload.userName,
      userEmail: payload.userEmail,
      userAvatar: payload.userAvatar,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    signOutUser: () => initialState,
  },
});
