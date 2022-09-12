import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import mainScreen from '../screens/mainScreen';

const MainTab = createBottomTabNavigator();

const tabNavOptions = {
  tabBarActiveTintColor: '#fff',
  tabBarActiveBackgroundColor: '#FF6C00',
  tabBarInactiveTintColor: '#212121',
  tabBarInactiveBackgroundColor: '#fff',
  tabBarItemStyle: {
    marginVertical: 8,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    height: 70,
    paddingHorizontal: 80,
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
        name="Posts"
        component={mainScreen.PostsScreen}
        options={{
          ...tabScreenOptions,
          tabBarActiveTintColor: '#212121',
          tabBarActiveBackgroundColor: '#fff',
          tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
          headerTitle: 'Публикации',
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // TODO ->> log out
              }}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
      <MainTab.Screen
        name="Create"
        component={mainScreen.CreatePostsScreen}
        options={{
          ...tabScreenOptions,
          tabBarIcon: ({ color }) => <AntDesign name="plus" size={24} color={color} />,
          headerTitle: 'Создать публикацию',
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={mainScreen.ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          headerShown: false,
        }}
      />
    </MainTab.Navigator>
  );
}
