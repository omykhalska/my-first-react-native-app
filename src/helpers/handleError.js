import { Alert } from 'react-native';

export const handleError = e => {
  Alert.alert('Произошла ошибка', e.message);
  console.log(e.message);
};
