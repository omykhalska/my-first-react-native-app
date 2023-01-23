import {
  Alert,
  Button,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
import { storage, db } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { getUserId, getUserName, getUserAvatar } from '../../redux/auth/authSelectors';
import { useIsFocused } from '@react-navigation/native'; // fixes a problem with a camera after changing screens
import { handleError } from '../../helpers/handleError';
import * as ImagePicker from 'expo-image-picker';
import { Loader } from '../../components';

const publicationSchema = yup.object({
  title: yup.string().required('Это поле не может быть пустым').min(2, 'Слишком короткое описание'),
});

export default function CreatePostsScreen({ navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const isFocused = useIsFocused();

  const [cameraRef, setCameraRef] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userName = useSelector(getUserName);
  const userId = useSelector(getUserId);
  const userPhotoURL = useSelector(getUserAvatar);

  useEffect(() => {
    if (!permission) {
      (async () => {
        await Camera.getCameraPermissionsAsync();
        await MediaLibrary.requestPermissionsAsync();

        await requestPermission();
      })();
    }
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
    })();
  }, []);

  useEffect(() => {
    const permissionFunction = async () => {
      const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (imagePermission.status !== 'granted') {
        Alert.alert('Permission for media access needed.');
      }
    };

    permissionFunction().catch(handleError);
  }, []);

  if (!permission) {
    return <Text>Получение разрешений...</Text>;
  }

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (permission.granted !== true) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Требуется разрешение на использование камеры</Text>
        <Button
          onPress={requestPermission}
          title="разрешить"
          style={{
            backgroundColor: '#FF6C00',
            borderRadius: 100,
          }}
        />
      </View>
    );
  }

  const getAddress = async coords => {
    try {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.city}, ${item.country}`;
        setAddress(address);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const takePhoto = async () => {
    try {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUrl(photo.uri);

      const { coords } = await Location.getCurrentPositionAsync();
      setLocation(coords);
      await getAddress(coords);
    } catch (e) {
      handleError(e);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [Dimensions.get('window').width, 240],
      });

      if (!result.cancelled) {
        setAddress('');
        setLocation(null);
        setPhotoUrl(result.uri);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const id = uuid.v4();
      const response = await fetch(photoUrl);
      const file = await response.blob();
      const storageRef = ref(storage, `postsImg/${id}`);

      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (e) {
      handleError(e);
    }
  };

  const uploadPostToServer = async values => {
    try {
      setIsLoading(true);
      const snapshot = await uploadPhotoToServer();

      await addDoc(collection(db, 'posts'), {
        photo: snapshot,
        title: values.title,
        location,
        address,
        userId,
        userName,
        userPhotoURL,
        createdAt: serverTimestamp(),
        comments: 0,
        likes: 0,
      });
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoto = async values => {
    await uploadPostToServer(values);
    navigation.navigate('Home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
      >
        <View style={{ flex: 1 }}>
          {isLoading && <Loader />}
          <View
            style={{
              ...styles.pictureBox,
              height: photoUrl ? 240 : ((Dimensions.get('window').width - 32) * 4) / 3,
            }}
          >
            {isFocused && !photoUrl ? (
              <Camera ref={setCameraRef} style={styles.camera}>
                <TouchableOpacity
                  style={styles.cameraBtnBox}
                  activeOpacity={0.2}
                  onPress={takePhoto}
                >
                  <MaterialIcons name="photo-camera" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              </Camera>
            ) : (
              photoUrl && (
                <View style={styles.picture}>
                  <Image source={{ uri: photoUrl }} style={{ width: '100%', height: 240 }} />
                </View>
              )
            )}
          </View>
          {!photoUrl ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickImage}
              style={{ ...styles.submitBtn, ...styles.uploadImgBtn }}
            >
              <Text style={styles.text}>Загрузить фото с галереи</Text>
            </TouchableOpacity>
          ) : (
            <Formik
              initialValues={{ title: '', location: '' }}
              validationSchema={publicationSchema}
              onSubmit={(values, { resetForm }) => {
                sendPhoto(values).catch(handleError);
                resetForm();
                setPhotoUrl('');
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                setFieldTouched,
                handleSubmit,
                isValid,
                dirty,
                resetForm,
              }) => (
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, minHeight: 300 }}>
                    <TextInput
                      value={values.title}
                      onChangeText={handleChange('title')}
                      onBlur={() => {
                        setFieldTouched('title');
                      }}
                      placeholder="Название..."
                      placeholderTextColor="#BDBDBD"
                      style={{ ...styles.input, fontWeight: '500' }}
                      underlineColorAndroid={'transparent'}
                    />
                    {errors.title && touched.title && (
                      <Text style={styles.errorText}>{errors.title}</Text>
                    )}

                    <TouchableOpacity
                      onPress={handleSubmit}
                      activeOpacity={0.8}
                      disabled={!(isValid && dirty && photoUrl)}
                      style={[
                        !(isValid && dirty && photoUrl)
                          ? styles.submitBtn
                          : {
                              ...styles.submitBtn,
                              backgroundColor: '#FF6C00',
                            },
                      ]}
                    >
                      <Text
                        style={[
                          !(isValid && dirty)
                            ? styles.buttonText
                            : {
                                ...styles.buttonText,
                                color: '#FFF',
                              },
                        ]}
                      >
                        Опубликовать
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      alignContent: 'center',
                      borderColor: 'blue',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPhotoUrl('');
                        resetForm();
                      }}
                      opacity={0.8}
                      style={styles.trashBtnBox}
                    >
                      <Feather name="trash-2" size={24} color="#BDBDBD" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          )}
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 32,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#fff',
  },
  pictureBox: {
    backgroundColor: '#E8E8E8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
  },
  picture: {
    width: '100%',
    height: 240,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  cameraBtnBox: {
    position: 'absolute',
    bottom: -30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadImgBtn: {
    marginTop: 46,
    backgroundColor: '#FF6C00',
  },
  text: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#fff',
  },
  input: {
    height: 50,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  errorText: {
    color: '#AF0606',
    fontSize: 12,
    textAlign: 'center',
  },
  submitBtn: {
    marginVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },
  trashBtnBox: {
    width: 70,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});
