import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const user = {
  name: 'Natali Romanova',
  email: 'email@example.com',
  avatar: 'https://i.pinimg.com/736x/6a/92/aa/6a92aa73d9838e2d26421b2e2546088b.jpg',
};

const posts = [
  {
    url: 'https://res.cloudinary.com/rebelwalls/image/upload/b_black,c_fit,f_auto,fl_progressive,q_auto,w_1333/v1428564288/article/R10141_image1',
    title: 'Лес',
    comments: [],
    location: 'Kiev',
    id: 1,
  },
  {
    url: 'https://img.freepik.com/free-photo/vertical-shot-body-water-with-pink-sky-during-sunset-perfect-wallpaper_181624-5246.jpg?w=2000',
    title: 'Sunset',
    comments: ['cool', 'not bad', '😍😍'],
    location: 'Casa-Blanca',
    id: 2,
  },
];

export default function PostsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.publication}>
      <Image source={{ uri: item.url }} style={styles.picture} />
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.extraData}>
        <View style={styles.comments}>
          <TouchableOpacity style={{ width: 24 }}>
            <Feather name="message-circle" size={24} color="#BDBDBD" style={styles.messageIcon} />
          </TouchableOpacity>
          <Text style={styles.commentsCount}>{item.comments.length}</Text>
        </View>
        <View style={styles.comments}>
          <TouchableOpacity>
            <Feather name="map-pin" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.user}>
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        <View style={styles.userDataBox}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.publications}>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{ marginBottom: 32 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#fff',
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  userDataBox: {
    marginLeft: 8,
  },
  userName: {
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 15,
    color: '#212121',
  },
  userEmail: {
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 13,
    color: '#212121',
  },
  publications: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 32,
  },
  publication: {
    marginBottom: 32,
  },
  picture: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
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
  },
  comments: {
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
