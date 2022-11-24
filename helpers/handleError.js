import { Alert } from 'react-native';

export const handleError = e => {
  Alert.alert('Error', e.message);
  console.log(e.message);
};
