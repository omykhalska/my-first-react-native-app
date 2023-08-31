import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import mainScreen from '../mainScreen';
import { AntDesign, Feather } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { authLogOutUser } from '../../redux/auth/authOperations';
import { COLORS } from '../../constants';
import { useAppDispatch } from '../../helpers/hooks';

export type BottomTabNavigatorParamList = {
  Home: undefined;
  Create: { image: string } | undefined;
  Profile: { image: string } | undefined;
};

const HomeTabs = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  return (
    <HomeTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.bgColor,
        tabBarActiveBackgroundColor: COLORS.accentColor,
        tabBarInactiveTintColor: COLORS.textPrimaryColor,
        tabBarInactiveBackgroundColor: COLORS.bgColor,
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
      }}
      initialRouteName='Home'
    >
      <HomeTabs.Screen
        name='Home'
        component={mainScreen.PostsScreen}
        options={() => ({
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
          tabBarActiveTintColor: COLORS.accentColor,
          tabBarActiveBackgroundColor: COLORS.bgColor,
          tabBarIcon: ({ color }) => (
            <Feather name='grid' size={24} color={color} />
          ),

          title: 'Feed',
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                dispatch(authLogOutUser());
              }}
            >
              <Feather
                name='log-out'
                size={24}
                color={COLORS.textSecondaryColor}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeTabs.Screen
        name='Create'
        component={mainScreen.CreatePostsScreen}
        options={({ navigation }) => ({
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
          tabBarStyle: {
            display: 'none',
          },
          tabBarItemStyle: {
            marginTop: 8,
            height: 40,
            maxWidth: 70,
            marginHorizontal: 10,
            borderRadius: 20,
            backgroundColor: COLORS.accentColor,
          },
          tabBarIcon: () => (
            <AntDesign name='plus' size={24} color={COLORS.bgColor} />
          ),
          title: 'Create a post',
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.setParams({
                  image: '',
                });
                navigation.dispatch(CommonActions.goBack());
              }}
            >
              <Feather
                name='arrow-left'
                size={24}
                color={COLORS.textPrimaryColor}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeTabs.Screen
        name='Profile'
        component={mainScreen.ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name='user' size={24} color={color} />
          ),
          tabBarActiveTintColor: COLORS.accentColor,
          tabBarActiveBackgroundColor: COLORS.bgColor,
          headerShown: false,
        }}
      />
    </HomeTabs.Navigator>
  );
}
