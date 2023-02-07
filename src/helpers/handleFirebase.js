import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleError } from './handleError';

export const updateUserData = async (uid, updateData) => {
  try {
    const q = await query(collection(db, 'users'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(document => {
      const docId = document.id;
      const docRef = doc(db, 'users', docId);
      updateDoc(docRef, updateData);
    });
  } catch (e) {
    handleError(e);
  }
};

export const getUserData = async userId => {
  try {
    let user = {};
    const q = await query(collection(db, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      user = { ...doc.data() };
    });
    return user;
  } catch (e) {
    handleError(e);
  }
};
