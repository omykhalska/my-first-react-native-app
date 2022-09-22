import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  userName: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      userName: payload.userName,
    }),
  },
});

// Action creators are generated for each case reducer function
//
// export const {} = authSlice.actions;
//
// export default authSlice.reducer;
