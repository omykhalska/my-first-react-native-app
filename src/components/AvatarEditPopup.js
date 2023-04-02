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
import { removeAvatar, uploadAvatarToServer } from '../firebase';
import { getUserAvatar } from '../redux/auth/authSelectors';
import { authUpdateUserPhoto } from '../redux/auth/authOperations';
import { handleError } from '../helpers/handleError';
import { pickImage, takePhoto } from '../helpers/handleImagePicker';
import { COLORS } from '../constants';

const imgOptions = {
  quality: 1,
  aspect: [1, 1],
  allowsEditing: true,
};

export const AvatarEditPopup = ({ visible, onPress, setIsLoadingPhoto }) => {
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
          await removeAvatar(userAvatar);
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
        userAvatar && (await removeAvatar(userAvatar));
        dispatch(authUpdateUserPhoto(avatarUrl));
      }
    } catch (e) {
      setIsLoadingPhoto(false);
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
                  <MaterialIcons name="image-search" size={24} color={COLORS.accentColor} />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Gallery</Text>
              </View>

              <View style={styles.centered}>
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onTakePhoto}>
                  <MaterialIcons name="photo-camera" size={24} color={COLORS.accentColor} />
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
    backgroundColor: COLORS.borderBtnColor,
  },
  menuView: {
    height: 'auto',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: COLORS.bgColor,
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
    color: COLORS.textPrimaryColor,
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
    borderColor: COLORS.borderBtnColor,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 8,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    color: COLORS.borderBtnColor,
    marginBottom: 8,
  },
  centered: {
    alignItems: 'center',
  },
});
