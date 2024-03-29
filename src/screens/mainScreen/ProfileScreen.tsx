import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState, useMemo } from 'react';
import {
  StatusBar,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  getUserAvatar,
  getUserId,
  getUserName,
} from '../../redux/auth/authSelectors';
import { Loader } from '../../components/Loader';
import { AvatarEditPopup } from '../../components/AvatarEditPopup';
import { Post } from '../../components/Post';
import {
  getUserPosts,
  removeAvatar,
  uploadPhotoToServer,
} from '../../firebase';
import { COLORS, IMAGES, SHADOW } from '../../constants';
import { authUpdateUserPhoto } from '../../redux/auth/authOperations';
import { handleError } from '../../helpers/handleError';
import { IPost } from '../../interfaces';
import { useAppDispatch } from '../../helpers/hooks';
import { BottomTabNavigatorParamList } from '../nestedScreens/HomeScreen';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<BottomTabNavigatorParamList, 'Profile'>;

export default function ProfileScreen({ navigation, route }: Props) {
  const userName = useSelector(getUserName);
  const userId = useSelector(getUserId)!;
  const userAvatar = useSelector(getUserAvatar);

  const dispatch = useAppDispatch();

  const photo = route.params?.image || null;

  const [posts, setPosts] = useState<null | IPost[]>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  useEffect(() => {
    if (photo) {
      changePhoto();
    }
  }, [route.params?.image]);

  useEffect(() => {
    setIsLoadingPhoto(false);
  }, [userAvatar]);

  useEffect(() => {
    getUserPosts(userId, setPosts);
  }, []);

  const togglePopup = () => setIsVisible((isVisible) => !isVisible);

  const changePhoto = async () => {
    try {
      setIsLoadingPhoto(true);
      const avatarUrl = await uploadPhotoToServer({
        photoUrl: photo!,
        photoDir: 'avatars',
      });
      userAvatar && (await removeAvatar(userAvatar));
      avatarUrl && dispatch(authUpdateUserPhoto(avatarUrl));
      navigation.setParams({ image: '' });
    } catch (e) {
      setIsLoadingPhoto(false);
      handleError(e);
    }
  };

  const renderItem = (item: IPost) => (
    <Post
      key={item.id}
      item={item}
      navigation={navigation}
      screen='ProfileScreen'
    />
  );
  const memoizedRenderItem = useMemo(() => renderItem, [posts]);

  return posts === null ? (
    <Loader>
      <Text>Downloading data...</Text>
    </Loader>
  ) : (
    <ImageBackground source={IMAGES.bgPattern} style={styles.image}>
      <SafeAreaView style={styles.container}>
        <AvatarEditPopup
          visible={isVisible}
          onPress={togglePopup}
          setIsLoadingPhoto={setIsLoadingPhoto}
          navigation={navigation}
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentBox}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {isLoadingPhoto ? (
                  <Loader />
                ) : (
                  <Image source={{ uri: userAvatar || undefined }} style={styles.image} />
                )}
              </View>
            </View>

            <View>
              <Text style={styles.userName}>{userName}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.buttonIcon, SHADOW]}
                onPressIn={togglePopup}
              >
                <MaterialIcons
                  name='mode-edit'
                  size={24}
                  color={COLORS.accentColor}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            {posts.length > 0 ? (
              <>
                <View style={styles.publications}>
                  {posts.map(memoizedRenderItem)}
                </View>
              </>
            ) : (
              <View style={styles.publications}>
                <Text
                  style={{
                    ...styles.title,
                    textAlign: 'center',
                    color: COLORS.textSecondaryColor,
                  }}
                >
                  No publications here yet...
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    resizeMode: 'cover',
  },
  contentBox: {
    flex: 1,
    flexGrow: 1,
    alignSelf: 'stretch',
    width: Dimensions.get('window').width,
    marginTop: StatusBar.currentHeight ? 148 - StatusBar.currentHeight : 148,
    paddingHorizontal: 16,
    backgroundColor: COLORS.bgColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatarContainer: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: COLORS.bgInputColor,
    borderRadius: 16,
  },
  avatar: {
    flex: 1,
    borderRadius: 16,
    zIndex: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.skeletonColor,
  },
  buttonIcon: {
    position: 'absolute',
    right: Dimensions.get('window').width / 2 - 90,
    top: 30,
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 11,
    backgroundColor: COLORS.bgColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  userName: {
    marginTop: 92,
    marginBottom: 32,
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 30,
    lineHeight: 35,
    color: COLORS.textPrimaryColor,
  },
  publications: {
    flex: 1,
    flexGrow: 1,
    paddingBottom: 12,
  },
  title: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
  },
});
