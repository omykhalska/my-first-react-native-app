import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getUserId } from '../redux/auth/authSelectors';

export const Comment = ({ data }) => {
  const { userId, userAvatar, commentText, createdAt } = data;

  const currentUserId = useSelector(getUserId);

  const getDate = () => createdAt?.toDate().toLocaleDateString() || 'Сегодня';

  const getTime = () => createdAt?.toDate().toLocaleTimeString().slice(0, 5) || 'Только что';

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
        <Image
          source={userAvatar ? { uri: userAvatar } : require('../assets/blank-profile-picture.png')}
          style={styles.avatar}
        />
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
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 18,
    color: '#212121',
  },
  commentDate: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 12,
    color: '#BDBDBD',
  },
  avatar: {
    width: 28,
    height: 28,
    backgroundColor: '#e8e8e8',
    borderRadius: 14,
  },
});
