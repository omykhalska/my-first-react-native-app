import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { storage } from '../firebase/config';
import { getUserAvatar } from '../redux/auth/authSelectors';
import { authUpdateUserPhoto } from '../redux/auth/authOperations';
import { handleError } from '../helpers/handleError';
import { pickImage, takePhoto } from '../helpers/handleImagePicker';

const imgOptions = {
  quality: 1,
  aspect: [1, 1],
  allowsEditing: true,
};

export const PhotoEditPopup = ({ visible, onPress, setIsLoadingPhoto }) => {
  const userAvatar = useSelector(getUserAvatar);
  const dispatch = useDispatch();

  const onDeletePhoto = () => {
    onPress();
    Alert.alert('Delete profile picture', 'Do you confirm the deletion ?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          await removePhoto();
          dispatch(authUpdateUserPhoto(''));
        },
      },
    ]);
  };

  const onTakePhoto = async () => {
    await changePhoto(takePhoto);
  };

  const onPickPhoto = async () => {
    await changePhoto(pickImage);
  };

  const changePhoto = async imagePickerFn => {
    try {
      onPress();
      const photo = await imagePickerFn(imgOptions);
      if (photo) {
        setIsLoadingPhoto(true);
        const avatarUrl = await uploadAvatarToServer(photo);
        userAvatar && (await removePhoto());
        dispatch(authUpdateUserPhoto(avatarUrl));
      }
    } catch (e) {
      setIsLoadingPhoto(false);
      handleError(e);
    }
  };

  const uploadAvatarToServer = async image => {
    try {
      const id = uuid.v4();
      const response = await fetch(image);
      const file = await response.blob();
      const storageRef = ref(storage, `avatars/${id}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (e) {
      handleError(e);
    }
  };

  const removePhoto = async () => {
    const avatarRef = ref(storage, userAvatar);
    try {
      await deleteObject(avatarRef);
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onPress}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.backdrop}>
          <View style={styles.menuView}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>Profile picture</Text>
              {userAvatar && (
                <TouchableOpacity style={{}} activeOpacity={0.8} onPress={onDeletePhoto}>
                  <MaterialIcons name="delete" size={24} color="rgba(0,0,0,0.6)" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.buttonsBox}>
              <View style={styles.centered}>
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPickPhoto}>
                  <MaterialIcons name="image-search" size={24} color="#FF6C00" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Gallery</Text>
              </View>

              <View style={styles.centered}>
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onTakePhoto}>
                  <MaterialIcons name="photo-camera" size={24} color="#FF6C00" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Camera</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  menuView: {
    height: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#fff',
    elevation: 20,
    padding: 16,
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '500',
    fontSize: 22,
    color: '#212121',
  },
  buttonsBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 8,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 8,
  },
  centered: {
    alignItems: 'center',
  },
});
