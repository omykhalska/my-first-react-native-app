import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '../screens/auth';
import HomeTabs from './TabNavigation';

const AuthStack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={auth.LoginScreen} />
      <AuthStack.Screen name="Sign up" component={auth.RegistrationScreen} />
      <AuthStack.Screen name="Home" component={HomeTabs} />
    </AuthStack.Navigator>
  );
}
