import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';
import { Loader } from '../components/Loader';
import { Text } from 'react-native';

const useRoute = (isAuth: boolean) => {
  switch (isAuth) {
    case false:
      return <AuthNavigation />;
    case true:
      return <MainNavigation />;
    default:
      return (
        <Loader>
          <Text>Login verification...</Text>
        </Loader>
      );
  }
};

export default useRoute;
