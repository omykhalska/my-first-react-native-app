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
import { IComment, ICoords, IPost, IUser } from './interfaces';

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

export const createNewUser = async (
  login: string,
  email: string,
  password: string,
  avatar: string,
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
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
    }
  } catch (e) {
    handleError(e);
  }
};

export const logInUser = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const logOutUser = async () => {
  await signOut(auth);
};

//Handle User & Post Data

export const updateUserData = async (uid: string, updateData: {}) => {
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

export const updateAvatar = async (avatar: string) => {
  try {
    if (auth.currentUser) {
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
    }
  } catch (e) {
    handleError(e);
  }
};

export const getUserData = async (userId: string): Promise<IUser | undefined> => {
  try {
    let user: IUser = {
      userAvatar: '',
      userEmail: '',
      userId: '',
      userName: '',
    };
    const q = await query(collection(db, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      user = {
        userAvatar: doc.data().userAvatar,
        userEmail: doc.data().userEmail,
        userId: doc.data().userId,
        userName: doc.data().userName,
      };
    });
    return user;
  } catch (e) {
    handleError(e);
  }
};

export const getAllPosts = async (setPosts: (posts: IPost[]) => void) => {
  try {
    const q = await query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    onSnapshot(q, async data => {
      const posts: IPost[] = [];
      for (const doc of data.docs) {
        const user = await getUserData(doc.data().userId);

        const { address, comments, createdAt, likes, location, photo, title, userId } = doc.data();

        posts.push({
          address,
          comments,
          createdAt,
          likes,
          location,
          photo,
          title,
          userId,
          id: doc.id,
          userName: user?.userName ?? '',
          userAvatar: user?.userAvatar ?? '',
        });
      }
      setPosts(posts);
    });
  } catch (e) {
    handleError(e);
  }
};

export const getAllComments = async (
  postId: string,
  setComments: (comments: IComment[]) => void,
) => {
  try {
    const docRef = doc(db, 'posts', postId);
    const colRef = await query(collection(docRef, 'comments'), orderBy('createdAt', 'desc'));
    await onSnapshot(colRef, async data => {
      const comments: IComment[] = [];
      for (const doc of data.docs) {
        const user = await getUserData(doc.data().userId);
        const { commentText, createdAt, userId } = doc.data();
        comments.push({
          commentText,
          createdAt,
          userId,
          id: doc.id,
          userAvatar: user?.userAvatar ?? '',
        });
      }
      setComments(comments);
    });
  } catch (e) {
    handleError(e);
  }
};

interface INewComment {
  postId: string;
  commentText: string;
  userId: string;
}

export const createComment = async (data: INewComment) => {
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

export const getUserPosts = async (userId: string, setPosts: (posts: IPost[]) => void) => {
  try {
    const q = await query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      where('userId', '==', userId),
    );

    onSnapshot(q, data => {
      const posts: IPost[] = data.docs.map(doc => {
        const { address, comments, createdAt, likes, location, photo, title, userId } = doc.data();
        return {
          address,
          comments,
          createdAt,
          likes,
          location,
          photo,
          title,
          userId,
          id: doc.id,
        };
      });
      setPosts(posts);
    });
  } catch (e) {
    handleError(e);
  }
};

export const setLike = async (postId: string, userId: string) => {
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, {
      likes: arrayUnion(userId),
    });
  } catch (e) {
    handleError(e);
  }
};

export const removeLike = async (postId: string, userId: string) => {
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, {
      likes: arrayRemove(userId),
    });
  } catch (e) {
    handleError(e);
  }
};

export const uploadPhotoToServer = async ({
  photoUrl,
  photoDir,
}: {
  photoUrl: string;
  photoDir: string;
}) => {
  try {
    const id = uuid.v4();
    const url = `${photoDir}/${id}`;

    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', photoUrl, true);
      xhr.send(null);
    });

    const storageRef = ref(storage, url);
    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  } catch (e) {
    console.error('Error uploading photo: ', e);
    handleError(e);
  }
};

interface IPostToUpload {
  data: {
    title: string;
    location: ICoords | null;
    address: string;
    userId: string;
  };
  photoUrl: string;
  photoDir: 'avatars' | 'postsImg';
}

export const uploadPostToServer = async ({ data, photoUrl, photoDir }: IPostToUpload) => {
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

export const removeAvatar = async (userAvatar: string) => {
  try {
    await deleteObject(ref(storage, userAvatar));
  } catch (e) {
    handleError(e);
  }
};

export const deletePost = async ({ photo, id }: { photo: string; id: string }) => {
  try {
    await deleteObject(ref(storage, photo));
    await deleteDoc(doc(db, 'posts', id));
  } catch (e) {
    handleError(e);
  }
};
