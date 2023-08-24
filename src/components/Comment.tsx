import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getUserId } from '../redux/auth/authSelectors';
import { COLORS, IMAGES } from '../constants';

export const Comment = ({ data }) => {
  const { userId, userAvatar, commentText, createdAt } = data;

  const currentUserId = useSelector(getUserId);

  const getDate = () => createdAt?.toDate().toLocaleDateString() || 'Today';

  const getTime = () => createdAt?.toDate().toLocaleTimeString().slice(0, 5) || 'Just now';

  return (
    <View
      style={{
        ...styles.commentBox,
        flexDirection: userId === currentUserId ? 'row-reverse' : 'row',
      }}
    >
      <View
        style={{
          marginLeft: userId === currentUserId ? 16 : 0,
          marginRight: userId === currentUserId ? 0 : 16,
        }}
      >
        <Image source={userAvatar ? { uri: userAvatar } : IMAGES.user} style={styles.avatar} />
      </View>
      <View
        style={{
          ...styles.comment,
          borderTopRightRadius: userId === currentUserId ? 0 : 6,
          borderTopLeftRadius: userId === currentUserId ? 6 : 0,
        }}
      >
        <Text>{commentText}</Text>
        <Text
          style={{
            alignSelf: userId === currentUserId ? 'flex-start' : 'flex-end',
            ...styles.commentDate,
          }}
        >{`${getDate(data)} | ${getTime(data)}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentBox: {
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  comment: {
    flex: 1,
    backgroundColor: COLORS.bgCommentColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textPrimaryColor,
  },
  commentDate: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 12,
    color: COLORS.textSecondaryColor,
  },
  avatar: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.skeletonColor,
    borderRadius: 14,
  },
});
