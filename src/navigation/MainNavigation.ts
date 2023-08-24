import nestedScreens from '../screens/nestedScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

const tabScreenOptions = {
  headerStyle: {
    backgroundColor: COLORS.bgColor,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 27.18,
  },
  headerTitleStyle: {
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: COLORS.textPrimaryColor,
  },
  headerTitleAlign: 'center',
};

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Posts" screenOptions={tabScreenOptions}>
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
      <Stack.Screen name="Map" component={nestedScreens.MapScreen} options={{ title: 'Map' }} />
      <Stack.Screen
        name="Camera"
        component={nestedScreens.CameraScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
