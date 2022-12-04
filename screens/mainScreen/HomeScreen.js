import { createNativeStackNavigator } from '@react-navigation/native-stack';
import nestedScreens from '../nestedScreens';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { authLogOutUser } from '../../redux/auth/authOperations';
import { Feather } from '@expo/vector-icons';

const NestedScreen = createNativeStackNavigator();

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
  headerTitleAlign: 'center',
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  return (
    <NestedScreen.Navigator initialRouteName="Posts" screenOptions={tabScreenOptions}>
      <NestedScreen.Screen
        name="Posts"
        component={nestedScreens.PostsScreen}
        options={{
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
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={nestedScreens.CommentsScreen}
        options={{ title: 'Комментарии' }}
      />
      <NestedScreen.Screen
        name="Map"
        component={nestedScreens.MapScreen}
        options={{ title: 'Карта' }}
      />
    </NestedScreen.Navigator>
  );
};

export default HomeScreen;
