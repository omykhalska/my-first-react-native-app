import {
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
import { useEffect, useId, useLayoutEffect, useState } from 'react';

const publicationSchema = yup.object({
  title: yup.string().required('Это поле не может быть пустым').min(2, 'Слишком короткое описание'),
  location: yup.string().min(2, 'Слишком короткое описание'),
});

export default function CreatePostsScreen({ navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (!permission) {
      (async () => {
        await Camera.getCameraPermissionsAsync();
        await MediaLibrary.requestPermissionsAsync();

        await requestPermission();
      })();
    }
  }, []);

  if (!permission) {
    return <Text>Получение разрешений...</Text>;
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

  const takePhoto = async () => {
    console.log('Camera in use');
    try {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUrl(photo.uri);
    } catch (e) {
      console.log(e.message);
    }
  };

  const sendPhoto = values => {
    navigation.navigate('Posts', {
      ...values,
      url: photoUrl,
      comments: [],
      likes: 0,
      id: photoUrl,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={200}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
      >
        <View>
          <View
            style={{
              ...styles.pictureBox,
              height: photoUrl ? 240 : ((Dimensions.get('window').width - 32) * 4) / 3,
            }}
          >
            <Camera ref={setCameraRef} style={styles.camera}>
              {photoUrl && (
                <View style={styles.picture}>
                  <Image source={{ uri: photoUrl }} style={{ width: '100%', height: 240 }} />
                </View>
              )}

              <TouchableOpacity
                style={{ ...styles.cameraBtnBox, display: photoUrl === '' ? 'flex' : 'none' }}
                activeOpacity={0.8}
                onPress={takePhoto}
              >
                <MaterialIcons name="photo-camera" size={24} color="#BDBDBD" />
              </TouchableOpacity>
            </Camera>
          </View>
          <Text style={styles.text}>Загрузите фото</Text>
          <Formik
            initialValues={{ title: '', location: '' }}
            validationSchema={publicationSchema}
            onSubmit={(values, { resetForm }) => {
              sendPhoto(values);
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
            }) => (
              <View>
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

                <View>
                  <TextInput
                    value={values.location}
                    onChangeText={handleChange('location')}
                    onBlur={() => {
                      setFieldTouched('location');
                    }}
                    placeholder="Местность..."
                    placeholderTextColor="#BDBDBD"
                    style={{ ...styles.input, paddingLeft: 28 }}
                    underlineColorAndroid={'transparent'}
                  />
                  <Feather name="map-pin" size={24} color="#BDBDBD" style={styles.locationIcon} />

                  {errors.location && touched.location && (
                    <Text style={styles.errorText}>{errors.location}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  disabled={!(isValid && dirty)}
                  style={[
                    !(isValid && dirty)
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
            )}
          </Formik>
        </View>

        {/*Trash Button START*/}
        <View>
          <TouchableOpacity
            onPress={() => {
              setPhotoUrl('');
              setCameraRef(null);
            }}
            opacity={0.8}
            style={styles.trashBtnBox}
          >
            <Feather name="trash-2" size={24} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
        {/*Trash Button END*/}
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
    borderStyle: 'solid',
    borderRadius: 8,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picture: {
    width: '100%',
    height: 240,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100000000,
  },
  cameraBtnBox: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  text: {
    marginTop: 8,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
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
  locationIcon: {
    position: 'absolute',
    left: 0,
    top: 25,
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
