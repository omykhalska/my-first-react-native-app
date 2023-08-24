import { Alert } from 'react-native';

export const handleError = e => {
  Alert.alert('An error has occurred', e.message);
  console.log(e.message);
};
