import nestedScreens from '../screens/nestedScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Posts"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgColor,
        },
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: 17,
          color: COLORS.textPrimaryColor,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Posts"
        component={nestedScreens.HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Comments"
        component={nestedScreens.CommentsScreen}
        options={{ title: 'Comments' }}
      />
      <Stack.Screen
        name="Map"
        component={nestedScreens.MapScreen}
        options={{ title: 'Map' }}
      />
      <Stack.Screen
        name="Camera"
        component={nestedScreens.CameraScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
