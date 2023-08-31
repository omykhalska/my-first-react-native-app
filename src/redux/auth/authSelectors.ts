import { RootState } from '../store'

export const getUserName = (state: RootState) => state.auth.userName

export const getUserId = (state: RootState) => state.auth.userId

export const getUserAvatar = (state: RootState) => state.auth.userAvatar

export const getStateChange = (state: RootState) => state.auth.stateChange
