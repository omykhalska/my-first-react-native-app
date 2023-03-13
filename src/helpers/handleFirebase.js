import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleError } from './handleError';

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

export const getAllPosts = async (cb = () => {}) => {
  try {
    const q = await query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    await onSnapshot(q, async data => {
      const posts = [];
      for (const doc of data.docs) {
        const { userName, userAvatar } = await getUserData(doc.data().userId);
        posts.push({ ...doc.data(), id: doc.id, userName, userAvatar });
      }
      cb(posts);
    });
  } catch (e) {
    handleError(e);
  }
};

export const setLike = async (postId, userId) => {
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, {
      likes: arrayUnion(userId),
    });
  } catch (e) {
    handleError(e);
  }
};

export const removeLike = async (postId, userId) => {
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, {
      likes: arrayRemove(userId),
    });
  } catch (e) {
    handleError(e);
  }
};
