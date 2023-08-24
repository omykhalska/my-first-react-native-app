import { authSlice } from './authReducer';
import { createNewUser, logInUser, logOutUser, updateAvatar, auth } from '../../firebase';
import { handleAuthErrors } from '../../helpers/handleAuthErrors';

import { onAuthStateChanged } from 'firebase/auth';

export const authRegisterUser = ({ login, email, password, avatar }) => {
  return async (dispatch, _) => {
    try {
      const user = await createNewUser(login, email, password, avatar);

      dispatch(authSlice.actions.updateUserProfile(user));
    } catch (error) {
      handleAuthErrors(error);
    }
  };
};

export const authLogInUser = (email, password) => async () => {
  try {
    await logInUser(email, password);
  } catch (error) {
    handleAuthErrors(error);
  }
};

export const authLogOutUser = () => async dispatch => {
  try {
    await logOutUser();

    dispatch(authSlice.actions.signOutUser({ stateChange: false }));
  } catch (error) {
    handleAuthErrors(error);
  }
};

export const authStateChangeUser = () => async dispatch => {
  await onAuthStateChanged(auth, user => {
    if (user) {
      const update = {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        userAvatar: user.photoURL,
      };

      dispatch(authSlice.actions.updateUserProfile(update));
      dispatch(authSlice.actions.authStateChange({ stateChange: true }));
    } else {
      dispatch(authSlice.actions.authStateChange({ stateChange: false }));
    }
  });
};

export const authUpdateUserPhoto = avatar => {
  return async (dispatch, _) => {
    try {
      const updatedUser = await updateAvatar(avatar);

      dispatch(authSlice.actions.updateUserProfile(updatedUser));
    } catch (error) {
      handleAuthErrors(error);
    }
  };
};
