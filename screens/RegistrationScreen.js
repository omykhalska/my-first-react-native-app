import {
  TouchableWithoutFeedback,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Linking,
  Keyboard,
  Image,
} from 'react-native';
import { Formik } from 'formik';

export default function RegistrationScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={require('../assets/bg-image.jpg')} style={styles.image}>
          <View style={styles.avatarContainer}>
            <View>
              <TouchableOpacity style={styles.buttonIcon} onPress={() => {}}>
                <Image source={require('../assets/icons/add.png')} style={styles.image} />
              </TouchableOpacity>
            </View>
          </View>
          <Formik
            initialValues={{ login: '', email: '', password: '' }}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              resetForm();
            }}
          >
            {props => (
              <View style={styles.regFormContainer}>
                <Text style={styles.formTitle}>Регистрация</Text>
                <TextInput
                  value={props.values.login}
                  onChangeText={props.handleChange('login')}
                  placeholder="Логин"
                  placeholderTextColor="#BDBDBD"
                  style={styles.input}
                  underlineColorAndroid={'transparent'}
                />
                <TextInput
                  value={props.values.email}
                  onChangeText={props.handleChange('email')}
                  placeholder="Адрес электронной почты"
                  placeholderTextColor="#BDBDBD"
                  style={styles.input}
                  autoComplete={'email'}
                  keyboardType={'email-address'}
                />
                <TextInput
                  value={props.values.password}
                  onChangeText={props.handleChange('password')}
                  placeholder="Пароль"
                  placeholderTextColor="#BDBDBD"
                  secureTextEntry={true}
                  style={styles.input}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={props.handleSubmit}>
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={styles.text}
                  accessibilityRole="link"
                  onPress={() => Linking.openURL('https://www.google.com/')}
                >
                  Уже есть аккаунт? Войти
                </Text>
              </View>
            )}
          </Formik>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-end',
    // fontFamily: 'Roboto-Regular',
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
    height: 25,
    width: 25,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
