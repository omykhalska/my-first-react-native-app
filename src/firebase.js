import { initializeApp } from 'firebase/app';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleError } from './helpers/handleError';

const firebaseConfig = {
  apiKey: 'AIzaSyB_q0Gem2u8WKRms8mWUgMeZ_Du0CM-OiE',
  authDomain: 'my-first-react-native-ap-5eaf7.firebaseapp.com',
  databaseURL: 'https://my-first-react-native-ap-5eaf7-default-rtdb.firebaseio.com',
  projectId: 'my-first-react-native-ap-5eaf7',
  storageBucket: 'my-first-react-native-ap-5eaf7.appspot.com',
  messagingSenderId: '177465730605',
  appId: '1:177465730605:web:0aac2b30271f9b7352baa4',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

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
