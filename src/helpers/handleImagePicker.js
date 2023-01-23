import * as ImagePicker from 'expo-image-picker';
import { handleError } from './handleError';
import { Alert } from 'react-native';

export const permissionFunction = async () => {
  const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (imagePermission.status !== 'granted') {
    Alert.alert('Permission for media access needed.');
  }
};

export const pickImage = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      return result.uri;
    }
  } catch (e) {
    handleError(e);
  }
};

export const takePhoto = async () => {
  try {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      return result.uri;
    }
  } catch (e) {
    handleError(e);
  }
};
