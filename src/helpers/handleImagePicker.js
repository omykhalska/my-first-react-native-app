import * as ImagePicker from 'expo-image-picker';
import { handleError } from './handleError';
import { Alert } from 'react-native';

export const permissionFunction = async () => {
  const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (imagePermission.status !== 'granted') {
    Alert.alert('Permission for media access needed.');
  }
};

export const pickImage = async (options = {}) => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.cancelled) {
      return result.uri;
    }
  } catch (e) {
    handleError(e);
  }
};

export const takePhoto = async options => {
  try {
    let result = await ImagePicker.launchCameraAsync(options);

    if (!result.cancelled) {
      return result.uri;
    }
  } catch (e) {
    handleError(e);
  }
};
