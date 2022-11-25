import { auth } from '../../firebase/config';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { handleAuthErrors } from '../../helpers/handleAuthErrors';
import { authSlice } from './authReducer';

export const authRegisterUser = ({ login, email, password, avatar }) => {
  return async (dispatch, _) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: avatar,
      });

      const { uid, displayName, photoURL } = auth.currentUser;

      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          userName: displayName,
          userEmail: email,
          userAvatar: photoURL,
        }),
      );
    } catch (error) {
      handleAuthErrors(error);
    }
  };
};

export const authLogInUser = (email, password) => async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleAuthErrors(error);
  }
};

export const authLogOutUser = () => async dispatch => {
  try {
    await signOut(auth);
    dispatch(authSlice.actions.signOutUser());
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
    }
  });
};
