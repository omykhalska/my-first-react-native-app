import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserEmail, getUserName } from '../../redux/auth/authSelectors';

import USER from '../../data/user';

export default function PostsScreen({ navigation, route }) {
  const userName = useSelector(getUserName);
  const userEmail = useSelector(getUserEmail);

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(USER);

  useEffect(() => {
    if (route.params) setPosts(prevState => [...prevState, route.params]);
  }, [route.params]);

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
        {item.location && (
          <View style={styles.comments}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Map', location);
              }}
            >
              <Feather name="map-pin" size={24} color="#BDBDBD" />
            </TouchableOpacity>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        <View style={styles.userDataBox}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>

      {posts.length > 0 ? (
        <View style={styles.publications}>
          <FlatList data={posts} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
      ) : (
        <View style={styles.publications}>
          <Text style={{ ...styles.title, textAlign: 'center', color: '#BDBDBD' }}>
            Здесь еще нет публикаций...
          </Text>
        </View>
      )}
    </View>
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
  skeleton: {
    marginTop: 8,
    height: 36,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
  },
});
