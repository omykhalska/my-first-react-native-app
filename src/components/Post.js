import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { setLike, removeLike } from '../firebase';
import { useSelector } from 'react-redux';
import { getUserId } from '../redux/auth/authSelectors';
import { COLORS } from '../constants';

export const Post = ({ item, navigation, screen = 'Post' }) => {
  const [isLiked, setIsLiked] = useState(null);

  const userId = useSelector(getUserId);

  useEffect(() => {
    setIsLiked(item.likes.includes(userId));
  });

  const toggleLike = async () => {
    if (isLiked) {
      await removeLike(item.id, userId);
    } else {
      await setLike(item.id, userId);
    }
  };

  return (
    <View style={styles.publication}>
      {screen === 'Post' ? (
        <View style={styles.userDataBox}>
          <Image
            source={
              item.userAvatar
                ? { uri: item.userAvatar }
                : require('../assets/blank-profile-picture.png')
            }
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
      ) : null}
      <Image source={{ uri: item.photo }} style={styles.picture} />
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.extraData}>
        <View style={styles.centered}>
          <TouchableOpacity style={styles.centered} onPress={toggleLike}>
            <AntDesign name={isLiked ? 'like1' : 'like2'} size={24} color={COLORS.accentColor} />
            <Text style={styles.commentsCount}>{item.likes?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.centered, marginLeft: 24 }}
            onPress={() => {
              navigation.navigate('Comments', { postId: item.id, postImage: item.photo });
            }}
          >
            <AntDesign name="message1" size={24} color={COLORS.accentColor} />
            <Text style={styles.commentsCount}>{item.comments}</Text>
          </TouchableOpacity>
        </View>

        {item.location && (
          <View>
            <TouchableOpacity
              style={styles.centered}
              onPress={() => {
                navigation.navigate('Map', { location: item.location });
              }}
            >
              <AntDesign name="enviromento" size={24} color={COLORS.accentColor} />
              <Text style={styles.location}>{item.address}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  publication: {
    marginBottom: 32,
  },
  userDataBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.skeletonColor,
    borderRadius: 14,
  },
  userName: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 15,
    color: COLORS.textPrimaryColor,
  },
  picture: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    backgroundColor: COLORS.skeletonColor,
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
  },
  extraData: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  centered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {
    transform: [{ rotateY: '180deg' }],
  },
  commentsCount: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
  },
  location: {
    marginLeft: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
    textDecorationLine: 'underline',
  },
});
