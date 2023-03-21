import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';
import { Loader } from '../components/Loader';

const useRoute = isAuth => {
  switch (isAuth) {
    case false:
      return <AuthNavigation />;
    case true:
      return <MainNavigation />;
    default:
      return <Loader />;
  }
};

export default useRoute;
