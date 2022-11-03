import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
