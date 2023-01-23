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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pickImage } from '../helpers/handleImagePicker';
import { getUserAvatar } from '../redux/auth/authSelectors';
import { storage } from '../firebase/config';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { handleError } from '../helpers/handleError';
import { authUpdateUserPhoto } from '../redux/auth/authOperations';
import uuid from 'react-native-uuid';

export const PhotoEditPopup = ({ visible, onPress }) => {
  const userAvatar = useSelector(getUserAvatar);
  const dispatch = useDispatch();

  const onDeletePhoto = () => {
    onPress();
    Alert.alert('Удалить фото профиля', 'Вы подтверждаете удаление ?', [
      {
        text: 'Отменить',
        onPress: () => {},
        style: 'cancel',
      },
      { text: 'Удалить', onPress: removePhoto },
    ]);
  };

  const onTakePhoto = () => {
    onPress();
    Alert.alert('Capture a new photo');
  };

  const onPickPhoto = async () => {
    try {
      onPress();
      const photo = await pickImage();
      const avatarUrl = await uploadAvatarToServer(photo);
      userAvatar && (await removePhoto());
      dispatch(authUpdateUserPhoto(avatarUrl));
    } catch (e) {
      console.log('onPickPhoto error');
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
      console.log('error while uploading');
      handleError(e);
    }
  };

  const removePhoto = async () => {
    const avatarRef = ref(storage, userAvatar);

    console.log('userAvatar in removePhoto fn =>', userAvatar);
    console.log('avatarRef in removePhoto fn =>', avatarRef);
    try {
      await deleteObject(avatarRef);
      dispatch(authUpdateUserPhoto(''));
    } catch (e) {
      console.log('error while deleting');
      handleError(e);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onPress}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.backdrop}>
          <View style={styles.menuView}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>Фото профиля</Text>
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
                <Text style={styles.buttonText}>Галерея</Text>
              </View>

              <View style={styles.centered}>
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onTakePhoto}>
                  <MaterialIcons name="photo-camera" size={24} color="#FF6C00" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Камера</Text>
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
