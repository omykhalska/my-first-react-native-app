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
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authLogInUser } from '../../redux/auth/authOperations';

const loginSchema = yup.object({
  email: yup.string().required('This field can not be empty').email('Invalid e-mail address'),
  password: yup.string().required('This field can not be empty'),
});

export default function LoginScreen({ navigation }) {
  const [focusedItem, setFocusedItem] = useState('');
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const passwordRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/bg-image.jpg')} style={styles.image}>
          <View style={styles.regFormContainer}>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={(values, { resetForm }) => {
                const { email, password } = values;
                dispatch(authLogInUser(email, password));
                resetForm();
              }}
            >
              {props => (
                <View>
                  <Text style={styles.formTitle}>Login</Text>
                  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
                    <TextInput
                      value={props.values.email}
                      onChangeText={props.handleChange('email')}
                      onFocus={() => {
                        setFocusedItem('email');
                      }}
                      onBlur={() => {
                        props.setFieldTouched('email');
                        setFocusedItem('');
                      }}
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      blurOnSubmit={false}
                      returnKeyType="next"
                      returnKeyLabel="next"
                      placeholder="E-mail address"
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

                    <View style={{ marginBottom: isKeyboardVisible ? keyboardHeight : 0 }}>
                      <TextInput
                        value={props.values.password}
                        onChangeText={props.handleChange('password')}
                        onFocus={() => {
                          setFocusedItem('password');
                        }}
                        onBlur={() => {
                          props.setFieldTouched('password');
                          setFocusedItem('');
                        }}
                        ref={passwordRef}
                        returnKeyType="go"
                        returnKeyLabel="go"
                        placeholder="Password"
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
                    onPress={props.handleSubmit}
                    activeOpacity={0.8}
                    style={{
                      ...styles.buttonContainer,
                      display: isKeyboardVisible ? 'none' : 'flex',
                    }}
                  >
                    <Text style={styles.buttonText}>Log in</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <TouchableOpacity onPress={() => navigation.navigate('Sign up')} activeOpacity={0.8}>
              <Text
                style={{
                  ...styles.text,
                  marginBottom: isKeyboardVisible ? 20 : 110,
                  display: isKeyboardVisible ? 'none' : 'flex',
                }}
              >
                Don't have an account? SIGN UP
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
    marginTop: 32,
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
    opacity: 1,
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
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#1B4371',
    opacity: 1,
  },
});
