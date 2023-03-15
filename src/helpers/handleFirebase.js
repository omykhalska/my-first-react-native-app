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
  addDoc,
  serverTimestamp,
  increment,
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

export const getAllPosts = async setPosts => {
  try {
    const q = await query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    await onSnapshot(q, async data => {
      const posts = [];
      for (const doc of data.docs) {
        const { userName, userAvatar } = await getUserData(doc.data().userId);
        posts.push({ ...doc.data(), id: doc.id, userName, userAvatar });
      }
      setPosts(posts);
    });
  } catch (e) {
    handleError(e);
  }
};

export const getAllComments = async (postId, setComments) => {
  try {
    const docRef = doc(db, 'posts', postId);
    const colRef = await query(collection(docRef, 'comments'), orderBy('createdAt', 'desc'));
    await onSnapshot(colRef, async data => {
      const comments = [];
      for (const doc of data.docs) {
        const { userAvatar } = await getUserData(doc.data().userId);
        comments.push({ ...doc.data(), id: doc.id, userAvatar });
      }
      setComments(comments);
    });
  } catch (e) {
    handleError(e);
  }
};

export const createComment = async data => {
  const { postId, commentText, userId } = data;
  try {
    const docRef = doc(db, 'posts', postId);
    const colRef = collection(docRef, 'comments');
    await addDoc(colRef, {
      commentText,
      userId,
      createdAt: serverTimestamp(),
    });
    await updateDoc(docRef, { comments: increment(1) });
  } catch (e) {
    handleError(e);
  }
};

export const getUserPosts = async (userId, setPosts) => {
  try {
    const q = await query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      where('userId', '==', userId),
    );

    await onSnapshot(q, data => {
      const posts = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(posts);
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
