import { auth } from '../../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { handleAuthErrors } from '../../helpers/handleAuthErrors';
import { authSlice } from './authReducer';

export const authRegisterUser = ({ login, email, password }) => {
  return async (dispatch, getState) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      user.displayName = login;
      dispatch(
        authSlice.actions.updateUserProfile({ userId: user.uid, userName: user.displayName }),
      );
      console.log(user);
    } catch (error) {
      handleAuthErrors(error);
    }
  };
};

export const authLogInUser = (email, password) => async (dispatch, getState) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // return userCredential.user;
  } catch (error) {
    handleAuthErrors(error);
  }
};

export const authLogOutUser = () => {
  return async (dispatch, getState) => {
    try {
      await signOut(auth);
    } catch (error) {
      handleAuthErrors(error);
    }
  };
};
