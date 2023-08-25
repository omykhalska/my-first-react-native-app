import { FirebaseError } from 'firebase/app';
import { Alert } from 'react-native';

export const handleAuthErrors = (error: FirebaseError) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  switch (errorCode) {
    case 'auth/weak-password':
      Alert.alert('The password is too weak');
      break;
    case 'auth/email-already-in-use':
      Alert.alert('An account with this email address is already registered');
      break;
    case 'auth/invalid-email':
      Alert.alert('Invalid e-mail address');
      break;
    case 'auth/user-not-found':
      Alert.alert('No user was found');
      break;
    case 'auth/wrong-password':
      Alert.alert('Wrong password');
      break;
    default:
      Alert.alert(errorMessage);
  }
  console.log(error);
};
