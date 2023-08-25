import { Alert } from 'react-native';

export const handleError = (error: unknown) => {
  let message = 'Unknown Error';

  if (error instanceof Error) {
    message = error.message;
  }

  Alert.alert('An error has occurred: ', message);
  console.log(error);
};
