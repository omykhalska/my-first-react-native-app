import { createSlice } from '@reduxjs/toolkit';

export interface IState {
  userId: null | string | number,
  userName: null | string,
  userEmail: null | string,
  userAvatar: null | string,
  stateChange: null | boolean,
}

const initialState: IState = {
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  stateChange: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserProfile: (state:IState, { payload }) => ({
      ...state,
      userId: payload.userId,
      userName: payload.userName,
      userEmail: payload.userEmail,
      userAvatar: payload.userAvatar,
    }),
    authStateChange: (state:IState, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    signOutUser: (_, { payload }) => ({
      ...initialState,
      stateChange: payload.stateChange,
    }),
  },
});
