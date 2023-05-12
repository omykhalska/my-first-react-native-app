import { useEffect, useState } from 'react';
import {
  Alert,
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
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { uploadPostToServer } from '../../firebase';
import { getUserId } from '../../redux/auth/authSelectors';
import { handleError } from '../../helpers/handleError';
import { Loader } from '../../components/Loader';
import { pickImage } from '../../helpers/handleImagePicker';
import { COLORS, SHADOW, SCHEMAS } from '../../constants';
import { useMediaLibraryPermissions } from 'expo-image-picker';

const imgOptions = {
  quality: 1,
  allowsEditing: true,
  aspect: [4, 3],
};

const imgHeight = Math.round((Dimensions.get('window').width - 32) / 1.4);

export default function CreatePostsScreen({ navigation, route }) {
  const photo = route?.params?.image || '';

  const [photoUrl, setPhotoUrl] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, requestPermission] = useMediaLibraryPermissions();

  const userId = useSelector(getUserId);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location permission',
          'Permission to access location was denied. You can grant permission in the phone settings.',
        );
      }
    })();
  }, []);

  useEffect(() => {
    onTakenPhoto();
  }, [photo]);

  const onTakenPhoto = async () => {
    try {
      setPhotoUrl(photo);

      if (photo !== '') {
        const { coords } = await Location.getCurrentPositionAsync();
        setLocation(coords);
        await getAddress(coords);
      }
    } catch (e) {
      handleError(e);
    }
  };

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

  const onPickImage = async () => {
    try {
      if (!status.granted) {
        await requestPermission();
      } else {
        const image = await pickImage(imgOptions);
        setAddress('');
        setLocation(null);
        setPhotoUrl(image);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const sendPhoto = async ({ title }) => {
    try {
      const data = {
        title,
        location,
        address,
        userId,
      };
      setIsLoading(true);
      await uploadPostToServer({ data, photoUrl, photoDir: 'postsImg' });
      navigation.navigate('Home');
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
      >
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <View style={[styles.pictureBox, SHADOW]}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <View style={styles.buttonsBox}>
                    <TouchableOpacity
                      style={[styles.button, SHADOW]}
                      activeOpacity={0.8}
                      onPress={onPickImage}
                    >
                      <MaterialIcons name="image-search" size={24} color={COLORS.accentColor} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, SHADOW]}
                      activeOpacity={0.8}
                      // onPress={onTakePhoto}
                      onPress={() => {
                        navigation.navigate('Camera');
                      }}
                    >
                      <MaterialIcons name="photo-camera" size={24} color={COLORS.accentColor} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Formik
                initialValues={{ title: '', location: '' }}
                validationSchema={SCHEMAS.publicationSchema}
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
                        placeholder="Write your post title"
                        placeholderTextColor={COLORS.textSecondaryColor}
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
                                backgroundColor: COLORS.accentColor,
                              },
                        ]}
                      >
                        <Text
                          style={[
                            !(isValid && dirty)
                              ? styles.buttonText
                              : {
                                  ...styles.buttonText,
                                  color: COLORS.bgColor,
                                },
                          ]}
                        >
                          Publish
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
                        style={[styles.trashBtnBox, SHADOW]}
                      >
                        <Feather name="trash-2" size={24} color={COLORS.textSecondaryColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </>
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
    backgroundColor: COLORS.bgColor,
  },
  pictureBox: {
    height: imgHeight,
    backgroundColor: COLORS.skeletonColor,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  buttonsBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    backgroundColor: COLORS.bgColor,
    borderRadius: 30,
  },
  uploadImgBtn: {
    marginTop: 46,
    backgroundColor: COLORS.accentColor,
  },
  text: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.bgColor,
  },
  input: {
    height: 50,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: COLORS.skeletonColor,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  errorText: {
    color: COLORS.warningColor,
    fontSize: 12,
    textAlign: 'center',
  },
  submitBtn: {
    marginVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: COLORS.bgInputColor,
    borderRadius: 100,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textSecondaryColor,
  },
  trashBtnBox: {
    width: 70,
    height: 40,
    backgroundColor: COLORS.bgInputColor,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});
