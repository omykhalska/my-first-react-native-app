import AuthNavigation from './AuthNavigation';
import TabNavigation from './TabNavigation';

const useRoute = isAuth => {
  if (!isAuth) {
    return <AuthNavigation />;
  } else {
    return <TabNavigation />;
  }
};

export default useRoute;
