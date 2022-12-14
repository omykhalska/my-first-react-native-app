import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import mainScreen from '../mainScreen';
import { AntDesign, Feather } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { authLogOutUser } from '../../redux/auth/authOperations';

const HomeTabs = createBottomTabNavigator();

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

export default function HomeScreen() {
  const dispatch = useDispatch();

  return (
    <HomeTabs.Navigator screenOptions={tabNavOptions}>
      <HomeTabs.Screen
        name="Home"
        component={mainScreen.PostsScreen}
        options={() => ({
          ...tabScreenOptions,
          tabBarActiveTintColor: '#FF6C00',
          tabBarActiveBackgroundColor: '#fff',
          tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,

          title: 'Публикации',
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                dispatch(authLogOutUser());
              }}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeTabs.Screen
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
      <HomeTabs.Screen
        name="Profile"
        component={mainScreen.ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          tabBarActiveTintColor: '#FF6C00',
          tabBarActiveBackgroundColor: '#fff',
          headerShown: false,
        }}
      />
    </HomeTabs.Navigator>
  );
}
