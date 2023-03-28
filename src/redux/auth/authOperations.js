import { auth, db } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { handleAuthErrors } from '../../helpers/handleAuthErrors';
import { authSlice } from './authReducer';
import { addDoc, collection } from 'firebase/firestore';
import { updateUserData } from '../../firebase';

export const authRegisterUser = ({ login, email, password, avatar }) => {
  return async (dispatch, _) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: avatar,
      });

      const { uid, displayName, photoURL } = auth.currentUser;

      const update = {
        userId: uid,
        userName: displayName,
        userEmail: email,
        userAvatar: photoURL,
      };

      await addDoc(collection(db, 'users'), update);

      dispatch(authSlice.actions.updateUserProfile(update));
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
      await updateProfile(auth.currentUser, {
        photoURL: avatar,
      });

      const { uid, displayName, photoURL, email } = auth.currentUser;

      await updateUserData(uid, { userAvatar: photoURL });

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
