import {
  TouchableWithoutFeedback,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { authRegisterUser } from '../../redux/auth/authOperations';
import uuid from 'react-native-uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { handleError } from '../../helpers/handleError';

const registerSchema = yup.object({
  login: yup
    .string()
    .required('Это поле не может быть пустым')
    .min(2, 'Слишком короткий логин')
    .max(32, 'Слишком длинный логин'),
  email: yup
    .string()
    .required('Это поле не может быть пустым')
    .email('Невалидный электронный адрес'),
  password: yup
    .string()
    .required('Это поле не может быть пустым')
    .min(8, 'Слишком короткий пароль')
    .max(32, 'Пароль не может содержать больше 32 символов'),
});

export default function RegistrationScreen({ navigation }) {
  const [focusedItem, setFocusedItem] = useState('');
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    permissionFunction();
  }, []);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const uploadAvatarToServer = async () => {
    try {
      const id = uuid.v4();
      const response = await fetch(imageUri);
      const file = await response.blob();
      const storageRef = ref(storage, `avatars/${id}`);

      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (e) {
      handleError(e);
    }
  };

  const handleRegisterClick = async values => {
    const avatarUrl = await uploadAvatarToServer();
    const data = { ...values, avatar: avatarUrl };
    dispatch(authRegisterUser(data));
  };

  const removeAvatar = () => {
    setImageUri(null);
  };

  const permissionFunction = async () => {
    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (imagePermission.status !== 'granted') {
      Alert.alert('Permission for media access needed.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/bg-image.jpg')} style={styles.image}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            {!imageUri ? (
              <TouchableOpacity activeOpacity={0.8} style={styles.buttonIcon} onPress={pickAvatar}>
                <AntDesign name="pluscircleo" size={25} color="#FF6C00" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonIcon}
                onPress={removeAvatar}
              >
                <AntDesign name="delete" size={25} color="#FF6C00" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.regFormContainer}>
            <Formik
              initialValues={{ login: '', email: '', password: '' }}
              validationSchema={registerSchema}
              onSubmit={handleRegisterClick}
            >
              {props => (
                <View style={{ marginBottom: isKeyboardVisible ? 32 : 0 }}>
                  <Text style={styles.formTitle}>Регистрация</Text>
                  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
                    <TextInput
                      value={props.values.login}
                      onChangeText={props.handleChange('login')}
                      onFocus={() => setFocusedItem('login')}
                      onBlur={() => {
                        props.setFieldTouched('login');
                        setFocusedItem('');
                      }}
                      placeholder="Логин"
                      placeholderTextColor="#BDBDBD"
                      style={[
                        focusedItem === 'login'
                          ? { ...styles.input, ...styles.inputOnFocus }
                          : styles.input,
                      ]}
                      underlineColorAndroid={'transparent'}
                    />
                    {props.errors.login && props.touched.login && (
                      <Text style={styles.errorText}>{props.errors.login}</Text>
                    )}

                    <TextInput
                      value={props.values.email}
                      onChangeText={props.handleChange('email')}
                      onFocus={() => setFocusedItem('email')}
                      onBlur={() => {
                        props.setFieldTouched('email');
                        setFocusedItem('');
                      }}
                      placeholder="Адрес электронной почты"
                      placeholderTextColor="#BDBDBD"
                      autoComplete={'email'}
                      keyboardType={'email-address'}
                      style={[
                        focusedItem === 'email'
                          ? { ...styles.input, ...styles.inputOnFocus }
                          : styles.input,
                      ]}
                      underlineColorAndroid={'transparent'}
                    />
                    {props.errors.email && props.touched.email && (
                      <Text style={styles.errorText}>{props.errors.email}</Text>
                    )}

                    <View>
                      <TextInput
                        value={props.values.password}
                        onChangeText={props.handleChange('password')}
                        onFocus={() => setFocusedItem('password')}
                        onBlur={() => {
                          props.setFieldTouched('password');
                          setFocusedItem('');
                        }}
                        placeholder="Пароль"
                        placeholderTextColor="#BDBDBD"
                        secureTextEntry={isHiddenPassword}
                        style={[
                          focusedItem === 'password'
                            ? { ...styles.input, ...styles.inputOnFocus }
                            : styles.input,
                        ]}
                        underlineColorAndroid={'transparent'}
                      />
                      <TouchableOpacity
                        style={styles.passwordIcon}
                        activeOpacity={0.8}
                        onPress={() => setIsHiddenPassword(!isHiddenPassword)}
                      >
                        <Ionicons
                          name={isHiddenPassword ? 'ios-eye' : 'ios-eye-off'}
                          size={28}
                          color="#808080"
                        />
                      </TouchableOpacity>

                      {props.errors.password && props.touched.password && (
                        <Text style={styles.errorText}>{props.errors.password}</Text>
                      )}
                    </View>
                  </KeyboardAvoidingView>

                  <TouchableOpacity
                    style={{
                      ...styles.buttonContainer,
                      display: isKeyboardVisible ? 'none' : 'flex',
                    }}
                    activeOpacity={0.8}
                    onPress={props.handleSubmit}
                  >
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  ...styles.text,
                  display: isKeyboardVisible ? 'none' : 'flex',
                }}
              >
                Уже есть аккаунт? Войти
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    marginBottom: -60,
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    zIndex: 10,
  },
  buttonIcon: {
    position: 'absolute',
    right: -13,
    top: 81,
    height: 26,
    width: 26,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorText: {
    color: '#AF0606',
    fontSize: 12,
    textAlign: 'center',
  },
  regFormContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  formTitle: {
    marginTop: 92,
    marginBottom: 16,
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 35,
    letterSpacing: 0.01,
  },
  input: {
    height: 50,
    marginTop: 16,
    padding: 16,
    paddingRight: 40,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E8E8E8',
    borderRadius: 8,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  inputOnFocus: {
    backgroundColor: '#fff',
    borderColor: '#FF6C00',
  },
  passwordIcon: {
    position: 'absolute',
    right: 10,
    top: 25,
  },
  buttonContainer: {
    marginTop: 44,
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#fff',
  },
  text: {
    marginTop: 16,
    marginBottom: 44,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#1B4371',
  },
});
