import { createNativeStackNavigator } from '@react-navigation/native-stack';
import nestedScreens from '../nestedScreens';

const NestedScreen = createNativeStackNavigator();

const HomeScreen = () => {
  return (
    <NestedScreen.Navigator initialRouteName="Posts" screenOptions={{ headerShown: false }}>
      <NestedScreen.Screen name="Posts" component={nestedScreens.PostsScreen} />
      <NestedScreen.Screen name="Comments" component={nestedScreens.CommentsScreen} />
      <NestedScreen.Screen name="Map" component={nestedScreens.MapScreen} />
    </NestedScreen.Navigator>
  );
};

export default HomeScreen;
