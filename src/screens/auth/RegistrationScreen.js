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
  Image,
} from 'react-native';
import { Formik } from 'formik';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { authRegisterUser } from '../../redux/auth/authOperations';
import { uploadAvatarToServer } from '../../firebase';
import { permissionFunction, pickImage } from '../../helpers/handleImagePicker';
import { useKeyboard } from '../../helpers/hooks';
import { COLORS, IMAGES, SCHEMAS } from '../../constants';

const imgOptions = {
  quality: 1,
  aspect: [1, 1],
  allowsEditing: true,
};

export default function RegistrationScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [focusedItem, setFocusedItem] = useState('');
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [imageUri, setImageUri] = useState(null);

  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    permissionFunction();
  }, []);

  const pickAvatar = async () => {
    const photo = await pickImage(imgOptions);
    setImageUri(photo);
  };

  const handleRegisterClick = async values => {
    setIsLoading(true);
    const avatarUrl = await uploadAvatarToServer(imageUri);
    const data = { ...values, avatar: avatarUrl };
    dispatch(authRegisterUser(data));
    setIsLoading(false);
  };

  const removeAvatar = () => {
    setImageUri(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={IMAGES.bgPattern} style={styles.image}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            {!imageUri ? (
              <TouchableOpacity activeOpacity={0.8} style={styles.buttonIcon} onPress={pickAvatar}>
                <AntDesign name="pluscircleo" size={25} color={COLORS.accentColor} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonIcon}
                onPress={removeAvatar}
              >
                <AntDesign name="delete" size={25} color={COLORS.accentColor} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.regFormContainer}>
            <Formik
              initialValues={{ login: '', email: '', password: '' }}
              validationSchema={SCHEMAS.registerSchema}
              onSubmit={handleRegisterClick}
            >
              {props => (
                <View style={{ marginBottom: isKeyboardVisible ? keyboardHeight : 0 }}>
                  <Text style={styles.formTitle}>Create Account</Text>

                  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View>
                      <TextInput
                        value={props.values.login}
                        onChangeText={props.handleChange('login')}
                        onFocus={() => setFocusedItem('login')}
                        onBlur={() => {
                          props.setFieldTouched('login');
                          setFocusedItem('');
                        }}
                        onSubmitEditing={() => emailRef.current?.focus()}
                        blurOnSubmit={false}
                        returnKeyType="next"
                        returnKeyLabel="next"
                        placeholder="Your Name"
                        placeholderTextColor={COLORS.textSecondaryColor}
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
                    </View>

                    <View>
                      <TextInput
                        value={props.values.email}
                        onChangeText={props.handleChange('email')}
                        onFocus={() => setFocusedItem('email')}
                        onBlur={() => {
                          props.setFieldTouched('email');
                          setFocusedItem('');
                        }}
                        ref={emailRef}
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        blurOnSubmit={false}
                        returnKeyType="next"
                        returnKeyLabel="next"
                        placeholder="E-mail"
                        placeholderTextColor={COLORS.textSecondaryColor}
                        autoComplete="email"
                        keyboardType="email-address"
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
                    </View>

                    <View>
                      <TextInput
                        value={props.values.password}
                        onChangeText={props.handleChange('password')}
                        onFocus={() => setFocusedItem('password')}
                        onBlur={() => {
                          props.setFieldTouched('password');
                          setFocusedItem('');
                        }}
                        ref={passwordRef}
                        returnKeyType="go"
                        returnKeyLabel="go"
                        placeholder="Create Password"
                        placeholderTextColor={COLORS.textSecondaryColor}
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
                          color={COLORS.iconInputColor}
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
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>Create Account</Text>
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
                Already have an account? SIGN IN
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
    backgroundColor: COLORS.bgInputColor,
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
    color: COLORS.warningColor,
    fontSize: 12,
    textAlign: 'center',
  },
  regFormContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    backgroundColor: COLORS.bgColor,
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
    backgroundColor: COLORS.bgInputColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.skeletonColor,
    borderRadius: 8,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  inputOnFocus: {
    backgroundColor: COLORS.bgColor,
    borderColor: COLORS.accentColor,
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
    backgroundColor: COLORS.accentColor,
    borderRadius: 100,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.bgColor,
  },
  text: {
    marginTop: 16,
    marginBottom: 44,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textAuthColor,
  },
});
