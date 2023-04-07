import { initializeApp, getApps, getApp } from 'firebase/app';
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
  deleteDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  createUserWithEmailAndPassword,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleError } from './helpers/handleError';
import uuid from 'react-native-uuid';

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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// User Authentication

export const createNewUser = async (login, email, password, avatar) => {
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
  return update;
};

export const logInUser = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const logOutUser = async () => {
  await signOut(auth);
};

//Handle User & Post Data

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

export const updateAvatar = async avatar => {
  await updateProfile(auth.currentUser, {
    photoURL: avatar,
  });

  const { uid, displayName, photoURL, email } = auth.currentUser;

  await updateUserData(uid, { userAvatar: photoURL });

  return {
    userId: uid,
    userName: displayName,
    userEmail: email,
    userAvatar: photoURL,
  };
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

export const uploadPhotoToServer = async ({ photoUrl, photoDir }) => {
  try {
    const id = uuid.v4();
    const url = `${photoDir}/${id}`;

    const response = await fetch(photoUrl);
    const file = await response.blob();
    const storageRef = ref(storage, url);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (e) {
    handleError(e);
  }
};

export const uploadPostToServer = async ({ data, photoUrl, photoDir }) => {
  try {
    const snapshot = await uploadPhotoToServer({ photoUrl, photoDir });

    await addDoc(collection(db, 'posts'), {
      ...data,
      photo: snapshot,
      createdAt: serverTimestamp(),
      comments: 0,
      likes: [],
    });
  } catch (e) {
    handleError(e);
  }
};

export const removeAvatar = async userAvatar => {
  try {
    await deleteObject(ref(storage, userAvatar));
  } catch (e) {
    handleError(e);
  }
};

export const deletePost = async ({ photo, id }) => {
  try {
    await deleteObject(ref(storage, photo));
    await deleteDoc(doc(db, 'posts', id));
  } catch (e) {
    handleError(e);
  }
};
