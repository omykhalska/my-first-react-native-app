import { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Text,
  Linking,
} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import RegistrationScreen from './screens/RegistrationScreen';

const bgImgURL = {
  uri: 'https://cdn.vox-cdn.com/thumbor/Al48-pEnyIn2rlgKX7MIHNmlE68=/0x0:5563x3709/1200x800/filters:focal(2302x1311:3192x2201)/cdn.vox-cdn.com/uploads/chorus_image/image/65752607/1048232144.jpg.0.jpg',
};

export default function AppCopy() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'DynaPuff-Regular': require('./assets/fonts/DynaPuff-Regular.ttf'),
    'DynaPuff-Bold': require('./assets/fonts/DynaPuff-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const nameHandler = text => setName(text);
  const passwordHandler = text => setPassword(text);
  const onLogin = () => {
    console.log('Name: ', name);
    console.log('Password: ', password);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <ImageBackground source={bgImgURL} resizeMode="cover" style={styles.image}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput
              value={name}
              onChangeText={nameHandler}
              placeholder="Username"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={passwordHandler}
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
            />
            <Button title={'Login'} style={styles.input} onPress={onLogin} />
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    fontFamily: 'Roboto-Regular',
    ...Platform.select({
      ios: {
        backgroundColor: '#ff0000',
      },
      android: {
        backgroundColor: '#00ff00',
      },
    }),
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    fontFamily: 'DynaPuff-Regular',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
