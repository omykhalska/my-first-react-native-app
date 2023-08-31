import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IUser } from '../../interfaces'

export interface IState {
  userId: null | string
  userName: null | string
  userEmail: null | string
  userAvatar: null | string
  stateChange: null | boolean
}

const initialState: IState = {
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  stateChange: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }: PayloadAction<IUser>) => ({
      ...state,
      userId: payload.userId,
      userName: payload.userName,
      userEmail: payload.userEmail,
      userAvatar: payload.userAvatar,
    }),
    authStateChange: (
      state,
      { payload }: PayloadAction<{ stateChange: boolean }>
    ) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    signOutUser: (_, { payload }: PayloadAction<{ stateChange: boolean }>) => ({
      ...initialState,
      stateChange: payload.stateChange,
    }),
  },
})
