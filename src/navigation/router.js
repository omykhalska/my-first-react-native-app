import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';

const useRoute = isAuth => {
  if (!isAuth) {
    return <AuthNavigation />;
  } else {
    return <MainNavigation />;
  }
};

export default useRoute;
