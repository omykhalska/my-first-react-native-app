import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const Post = ({ item, navigation, screen = 'Post' }) => (
  <View style={styles.publication} key={item.id}>
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
        <TouchableOpacity style={styles.centered} onPress={() => {}}>
          <Feather name="thumbs-up" size={24} color="#BDBDBD" />
          <Text style={styles.commentsCount}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.centered, marginLeft: 24 }}
          onPress={() => {
            navigation.navigate('Comments', { postId: item.id, postImage: item.photo });
          }}
        >
          <Feather name="message-circle" size={25} color="#BDBDBD" style={styles.messageIcon} />
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
            <Feather name="map-pin" size={24} color="#BDBDBD" />
            <Text style={styles.location}>{item.address}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

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
    backgroundColor: '#e8e8e8',
    borderRadius: 14,
  },
  userName: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 15,
    color: '#212121',
  },
  picture: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
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
    color: '#BDBDBD',
  },
  location: {
    marginLeft: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
    textDecorationLine: 'underline',
  },
});
