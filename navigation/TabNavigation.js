import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import mainScreen from '../screens/mainScreen';
import { CommonActions } from '@react-navigation/native';

const MainTab = createBottomTabNavigator();

const tabNavOptions = {
  tabBarActiveTintColor: '#fff',
  tabBarActiveBackgroundColor: '#FF6C00',
  tabBarInactiveTintColor: '#212121',
  tabBarInactiveBackgroundColor: '#fff',
  tabBarItemStyle: {
    marginTop: 8,
    height: 40,
    maxWidth: 70,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  tabBarStyle: {
    height: 62,
    alignItems: 'center',
  },
  tabBarShowLabel: false,
  headerTitleAlign: 'center',
};

const tabScreenOptions = {
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 27.18,
  },
  headerTitleStyle: {
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: '#212121',
  },
};

export default function TabNavigation() {
  return (
    <MainTab.Navigator screenOptions={tabNavOptions}>
      <MainTab.Screen
        name="Home"
        component={mainScreen.HomeScreen}
        options={() => ({
          ...tabScreenOptions,
          tabBarActiveTintColor: '#FF6C00',
          tabBarActiveBackgroundColor: '#fff',
          tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
          headerShown: false,
        })}
      />
      <MainTab.Screen
        name="Create"
        component={mainScreen.CreatePostsScreen}
        options={({ navigation }) => ({
          ...tabScreenOptions,
          tabBarStyle: {
            display: 'none',
          },
          tabBarItemStyle: {
            marginTop: 8,
            height: 40,
            maxWidth: 70,
            marginHorizontal: 10,
            borderRadius: 20,
            backgroundColor: '#FF6C00',
          },
          tabBarIcon: () => <AntDesign name="plus" size={24} color="#fff" />,
          title: 'Создать публикацию',
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(CommonActions.goBack())}>
              <Feather name="arrow-left" size={24} color="#212121" />
            </TouchableOpacity>
          ),
        })}
      />
      <MainTab.Screen
        name="Profile"
        component={mainScreen.ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          tabBarActiveTintColor: '#FF6C00',
          tabBarActiveBackgroundColor: '#fff',
          headerShown: false,
        }}
      />
    </MainTab.Navigator>
  );
}
